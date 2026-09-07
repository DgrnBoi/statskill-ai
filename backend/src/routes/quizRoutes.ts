import express from 'express';
import multer from 'multer';
import { QuizGeneratorService } from '../services/ai/QuizGenerator';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max limit
  fileFilter: (_req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf' || file.mimetype === 'text/plain';
    const ext = file.originalname.toLowerCase();
    const hasAllowedExt = ext.endsWith('.pdf') || ext.endsWith('.txt') || ext.endsWith('.md');
    if (isPdfMime || hasAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error('Only official PDF documents are permitted for assessment generation.'));
    }
  }
});

const handleSafeUpload = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload.single('document')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File size exceeds the maximum permitted limit of 15MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'Invalid file format. Only official PDF/text documents are permitted.' });
    }
    next();
  });
};

const quizService = new QuizGeneratorService();

// In-memory queue for hackathon prototype (Use Redis in production)
const jobQueue = new Map<string, { status: 'processing' | 'complete' | 'error', result?: any, error?: string }>();

// POST /api/quiz/generate-async
router.post('/generate-async', handleSafeUpload, (req, res) => {
  const mode = req.query.mode as string || 'MODERN_DEVICE';
  const isOffline = mode === 'POTATO_DEVICE' || mode === 'OFFLINE';

  const { difficulty, numQuestions, courseId, apiKey: bodyApiKey } = req.body || {};
  const customApiKey = (
    bodyApiKey ||
    req.headers['x-api-key'] ||
    req.headers['x-gemini-key'] ||
    req.headers['x-groq-key'] ||
    ''
  ) as string;

  if (!req.file && !isOffline && !courseId) {
    return res.status(400).json({ error: 'No document uploaded or course selected.' });
  }
  const filePath = req.file ? req.file.path : undefined;
  // Sanitize original filename against path traversal and null bytes
  const originalName = req.file 
    ? req.file.originalname.replace(/[/\\?%*:|"<>]/g, '_').replace(/\0/g, '').slice(0, 150)
    : (courseId ? String(courseId).replace(/[/\\?%*:|"<>]/g, '_').slice(0, 100) : 'Survey Design and Stratification');
  const jobId = Math.random().toString(36).substring(7); // Simple Job ID

  // 1. Immediately acknowledge the request (202 Accepted)
  jobQueue.set(jobId, { status: 'processing' });
  res.status(202).json({ 
    success: true, 
    jobId, 
    message: 'Document accepted. Generation started in background.' 
  });

  // 2. Process in the background without blocking the HTTP thread
  setTimeout(async () => {
    try {
      console.log(`[Job ${jobId}] Starting background generation for "${originalName}" in mode: ${mode}...`);
      const quiz = await quizService.generateFromPdf(
        filePath, 
        parseInt(numQuestions) || 5, 
        difficulty || 'intermediate',
        mode,
        originalName,
        customApiKey
      );
      
      console.log(`[Job ${jobId}] Generation complete. Produced ${quiz.questions.length} questions (mode: ${quiz.mode}).`);
      jobQueue.set(jobId, { status: 'complete', result: quiz });
    } catch (error: any) {
      console.error(`[Job ${jobId}] Generation Error:`, error);
      jobQueue.set(jobId, { status: 'error', error: error.message || 'Failed to generate quiz.' });
    } finally {
      // Auto-expire job from memory after 10 minutes
      setTimeout(() => {
        jobQueue.delete(jobId);
      }, 10 * 60 * 1000);
    }
  }, 0);
});

// GET /api/quiz/status/:jobId
router.get('/status/:jobId', (req, res) => {
  const job = jobQueue.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.status(200).json(job);
});

export default router;
