import express from 'express';
import multer from 'multer';
import { QuizGeneratorService } from '../services/ai/QuizGenerator';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are permitted for assessment generation.'));
    }
  }
});
const quizService = new QuizGeneratorService();

// In-memory queue for hackathon prototype (Use Redis in production)
const jobQueue = new Map<string, { status: 'processing' | 'complete' | 'error', result?: any, error?: string }>();

// POST /api/quiz/generate-async
router.post('/generate-async', upload.single('document'), (req, res) => {
  const mode = req.query.mode as string || 'MODERN_DEVICE';
  const isOffline = mode === 'POTATO_DEVICE' || mode === 'OFFLINE';

  if (!req.file && !isOffline) {
    return res.status(400).json({ error: 'No PDF document uploaded and not in offline mode.' });
  }

  const { difficulty, numQuestions, courseId } = req.body;
  const filePath = req.file ? req.file.path : undefined;
  const originalName = req.file ? req.file.originalname : (courseId || 'Survey Design and Stratification');
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
      console.log(`[Job ${jobId}] Starting background generation in mode: ${mode}...`);
      const quiz = await quizService.generateFromPdf(
        filePath, 
        parseInt(numQuestions) || 3, 
        difficulty || 'intermediate',
        mode,
        originalName
      );
      
      console.log(`[Job ${jobId}] Generation complete.`);
      jobQueue.set(jobId, { status: 'complete', result: quiz });
    } catch (error: any) {
      console.error(`[Job ${jobId}] Generation Error:`, error);
      jobQueue.set(jobId, { status: 'error', error: error.message || 'Failed to generate quiz.' });
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
