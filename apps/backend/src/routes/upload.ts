import { Router, Request, Response } from 'express';
import multer from 'multer';

// TODO: pdf-parse has ESM compatibility issues — using dynamic import
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are supported'));
    }
  },
});

// POST /api/v1/upload/extract-text
router.post(
  '/extract-text',
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    try {
      let text = '';

      if (req.file.mimetype === 'application/pdf') {
        // Dynamic import for pdf-parse (CommonJS module)
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(req.file.buffer);
        text = pdfData.text;
      } else {
        // Plain text file
        text = req.file.buffer.toString('utf-8');
      }

      // Cap at 10k chars
      res.json({ success: true, text: text.slice(0, 10000) });
    } catch (error) {
      console.error('File parsing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to extract text from file',
      });
    }
  }
);

export default router;
