import { Queue } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { executeGenerationJob } from './workers/generationWorker.js';
import Assignment from '../models/Assignment.js';
import { broadcastJobUpdate } from '../websocket/wsServer.js';

let bullQueue: Queue | null = null;

function getBullQueue() {
  if (!bullQueue && redisClient.status !== 'end') {
    try {
      bullQueue = new Queue('paper-generation', {
        connection: redisClient as any,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 50 },
        },
      });
      bullQueue.on('error', (err) => {
        if (redisClient.status !== 'end') {
          console.warn('⚠️ BullMQ queue connection warning:', err.message);
        }
      });
    } catch (err) {
      console.warn('⚠️ Failed to initialize BullMQ queue, using in-memory mode:', err);
    }
  }
  return bullQueue;
}

export const generationQueue = {
  add: async (name: string, data: any, options?: any) => {
    // If Redis is running/connecting, try to use BullMQ
    if (redisClient.status !== 'end') {
      try {
        const q = getBullQueue();
        if (q) {
          return await q.add(name, data, options);
        }
      } catch (err) {
        console.warn('⚠️ BullMQ queue add failed, falling back to in-memory mode:', err);
      }
    }

    // In-memory queue fallback
    console.log(`🔄 [In-Memory Queue] Enqueueing job: ${name} for assignment ${data.assignmentId}`);
    const jobId = options?.jobId || `in-memory-${Date.now()}`;
    
    // Execute asynchronously to mimic background worker
    setTimeout(async () => {
      try {
        await executeGenerationJob({ id: jobId, data });
        console.log(`✅ [In-Memory Queue] Job ${jobId} completed successfully`);
      } catch (err) {
        console.error(`❌ [In-Memory Queue] Job ${jobId} failed:`, err);
        const errorMessage = (err as Error).message;
        
        // Match worker error handling
        await Assignment.findByIdAndUpdate(data.assignmentId, {
          jobStatus: 'failed',
        });
        
        broadcastJobUpdate({
          jobId,
          assignmentId: data.assignmentId,
          status: 'failed',
          error: errorMessage,
        });
      }
    }, 1000);

    return { id: jobId };
  }
};
