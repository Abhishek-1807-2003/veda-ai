import { Router } from 'express';
import assignmentRoutes from './assignments.js';
import uploadRoutes from './upload.js';

const router = Router();

router.use('/assignments', assignmentRoutes);
router.use('/upload', uploadRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
