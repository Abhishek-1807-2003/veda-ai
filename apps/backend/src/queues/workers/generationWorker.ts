import { Worker, Job } from 'bullmq';
import { redisClient } from '../../config/redis.js';
import { buildPrompt } from '../../services/ai/promptBuilder.js';
import { getAIProvider } from '../../services/ai/aiProvider.js';
import { parsePaperFromLLMResponse } from '../../services/paperParser.js';
import { cacheSet } from '../../services/cacheService.js';
import Assignment from '../../models/Assignment.js';
import { broadcastJobUpdate } from '../../websocket/wsServer.js';
import type { CreateAssignmentDTO, GeneratedPaper } from '@vedaai/shared-types';

interface JobData {
  assignmentId: string;
  dto: CreateAssignmentDTO;
}

export async function executeGenerationJob(job: { id: string; data: JobData }) {
  const { assignmentId, dto } = job.data;

  // 1. Mark as processing
  await Assignment.findByIdAndUpdate(assignmentId, { jobStatus: 'processing' });
  broadcastJobUpdate({ jobId: job.id, assignmentId, status: 'processing' });

  // 2. Build prompt
  const prompt = buildPrompt(dto);

  // 3. Call AI
  const ai = getAIProvider();
  const rawResponse = await ai.generate(prompt);

  // 4. Parse and validate (NEVER render raw LLM output)
  const paper: GeneratedPaper = parsePaperFromLLMResponse(rawResponse, dto);

  // 5. Persist to MongoDB
  await Assignment.findByIdAndUpdate(assignmentId, {
    jobStatus: 'completed',
    generatedPaper: paper,
  });

  // 6. Cache result for fast retrieval (TTL: 1 hour)
  await cacheSet(`paper:${assignmentId}`, paper, 3600);

  // 7. Notify frontend via WebSocket
  broadcastJobUpdate({ jobId: job.id, assignmentId, status: 'completed', paper });
}

let worker: Worker | null = null;

// Only initialize BullMQ worker if Redis is not explicitly offline
if (redisClient.status !== 'end') {
  try {
    worker = new Worker<JobData>(
      'paper-generation',
      async (job: Job<JobData>) => {
        await executeGenerationJob({ id: job.id!, data: job.data });
      },
      { connection: redisClient as any, concurrency: 3 }
    );

    worker.on('error', (err) => {
      // Suppress verbose stack traces for Redis connection failures
      if (redisClient.status !== 'end') {
        console.warn('⚠️ BullMQ worker connection warning:', err.message);
      }
    });

    worker.on('failed', async (job, err) => {
      if (job) {
        await Assignment.findByIdAndUpdate(job.data.assignmentId, {
          jobStatus: 'failed',
        });
        broadcastJobUpdate({
          jobId: job.id!,
          assignmentId: job.data.assignmentId,
          status: 'failed',
          error: err.message,
        });
      }
    });

    worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed for assignment ${job.data.assignmentId}`);
    });
  } catch (err) {
    console.warn('⚠️ BullMQ worker failed to initialize, falling back to in-memory mode:', err);
  }
}

export default worker;
