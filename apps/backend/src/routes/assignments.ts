import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Assignment from '../models/Assignment.js';
import { generationQueue } from '../queues/queues.js';
import { validate } from '../middleware/validate.js';
import { cacheGet, cacheDelete } from '../services/cacheService.js';
import { generatePDF } from '../services/pdfService.js';
import type { CreateAssignmentDTO, GeneratedPaper } from '@vedaai/shared-types';

const router = Router();

// ── Validation Schemas ──────────────────────────────────────────────────────

const CreateAssignmentSchema = z.object({
  title: z.string().min(3).max(200),
  subject: z.string().min(1),
  className: z.string().min(1),
  schoolName: z.string().min(1),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeAllowed: z.coerce.number().int().min(15).max(300),
  questionTypes: z
    .array(
      z.object({
        type: z.enum([
          'Multiple Choice Questions',
          'Short Questions',
          'Diagram/Graph-Based Questions',
          'Numerical Problems',
        ]),
        count: z.coerce.number().int().min(1).max(50),
        marks: z.coerce.number().int().min(1).max(20),
      })
    )
    .min(1)
    .max(4),
  additionalInstructions: z.string().max(500).optional(),
  uploadedFileText: z.string().max(10000).optional(),
});

// ── POST /assignments — Create assignment, enqueue job ──────────────────────

router.post(
  '/',
  validate(CreateAssignmentSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateAssignmentDTO = req.body;

      const tempJobId = `pending-${Date.now()}`;

      const assignment = await Assignment.create({
        ...dto,
        assignedDate: new Date().toISOString(),
        jobId: tempJobId,
        jobStatus: 'pending',
      });

      // Add to BullMQ
      const job = await generationQueue.add(
        'generate-paper',
        { assignmentId: assignment._id.toString(), dto },
        { jobId: assignment._id.toString() }
      );

      // Update with real job id
      assignment.jobId = job.id!;
      await assignment.save();

      res.status(201).json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /assignments — List all assignments (paginated) ─────────────────────

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
      const search = (req.query.search as string) || '';

      const filter: Record<string, any> = {};
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      const [assignments, total] = await Promise.all([
        Assignment.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Assignment.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: assignments,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /assignments/:id — Get single assignment ────────────────────────────

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignment = await Assignment.findById(req.params.id).lean();
      if (!assignment) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Assignment not found' },
        });
        return;
      }
      res.json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /assignments/:id/paper — Get generated paper (cache-first) ──────────

router.get(
  '/:id/paper',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Try cache first
      const cached = await cacheGet<GeneratedPaper>(
        `paper:${req.params.id}`
      );
      if (cached) {
        res.json({ success: true, data: cached, source: 'cache' });
        return;
      }

      // Fallback to DB
      const assignment = await Assignment.findById(req.params.id).lean();
      if (!assignment) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Assignment not found' },
        });
        return;
      }

      if (!assignment.generatedPaper) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_GENERATED',
            message: 'Paper has not been generated yet',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: assignment.generatedPaper,
        source: 'db',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /assignments/:id/pdf — Stream PDF download ──────────────────────────

router.get(
  '/:id/pdf',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignment = await Assignment.findById(req.params.id).lean();
      if (!assignment?.generatedPaper) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Paper not available' },
        });
        return;
      }

      const pdfBuffer = await generatePDF(
        assignment.generatedPaper as GeneratedPaper
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="question-paper-${req.params.id}.pdf"`
      );
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /assignments/:id — Delete assignment ─────────────────────────────

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignment = await Assignment.findByIdAndDelete(req.params.id);
      if (!assignment) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Assignment not found' },
        });
        return;
      }

      // Clear cache
      await cacheDelete(`paper:${req.params.id}`);

      res.json({ success: true, message: 'Assignment deleted' });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /assignments/:id/regenerate — Re-enqueue generation job ────────────

router.post(
  '/:id/regenerate',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Assignment not found' },
        });
        return;
      }

      // Reset status
      assignment.jobStatus = 'pending';
      assignment.generatedPaper = undefined;

      const dto: CreateAssignmentDTO = {
        title: assignment.title,
        subject: assignment.subject,
        className: assignment.className,
        schoolName: assignment.schoolName,
        dueDate: assignment.dueDate,
        timeAllowed: assignment.timeAllowed,
        questionTypes: assignment.questionTypes,
        additionalInstructions: assignment.additionalInstructions,
      };

      // Re-enqueue
      const job = await generationQueue.add(
        'generate-paper',
        { assignmentId: assignment._id.toString(), dto },
        { jobId: `regen-${assignment._id}-${Date.now()}` }
      );

      assignment.jobId = job.id!;
      await assignment.save();

      // Clear old cache
      await cacheDelete(`paper:${assignment._id}`);

      res.json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
