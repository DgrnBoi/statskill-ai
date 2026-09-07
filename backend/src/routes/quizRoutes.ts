import fs from 'fs';
import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { QuizGeneratorService } from '../services/ai/QuizGenerator';
import { DocumentChunker } from '../services/ai/DocumentChunker';

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

// POST /api/quiz/inspect-document (Pre-generation inspection studio endpoint)
router.post('/inspect-document', handleSafeUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No document uploaded for inspection.' });
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname.replace(/[/\\?%*:|"<>]/g, '_').replace(/\0/g, '').slice(0, 150);

  try {
    let textContent = '';
    if (filePath.toLowerCase().endsWith('.pdf') || req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text || '';
    } else {
      textContent = fs.readFileSync(filePath, 'utf8');
    }

    const cleanedText = DocumentChunker.cleanText(textContent);
    if (!cleanedText || cleanedText.length < 50) {
      return res.status(400).json({ error: 'Uploaded document contains insufficient readable text.' });
    }

    const chunks = DocumentChunker.chunkDocument(cleanedText, 2000, 250);
    const wordCount = cleanedText.split(/\s+/).filter(w => w.length > 0).length;
    const estimatedPages = Math.max(1, Math.ceil(cleanedText.length / 2200));

    // Group sections and extract unique section titles
    const sectionMap = new Map<string, number>();
    for (const chunk of chunks) {
      const title = chunk.sectionTitle || 'General Section';
      sectionMap.set(title, (sectionMap.get(title) || 0) + 1);
    }

    const sections = Array.from(sectionMap.entries()).map(([title, chunkCount], idx) => ({
      id: `sec-${idx + 1}`,
      title,
      chunkCount
    }));

    // Detect statistical keywords frequency
    const statWords = ['sampling', 'stratification', 'multiplier', 'variance', 'estimation', 'fsu', 'ssu', 'household', 'cpi', 'gdp', 'nss', 'asi', 'plfs'];
    const lowerText = cleanedText.toLowerCase();
    const keywordDensity: Record<string, number> = {};
    for (const kw of statWords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches && matches.length > 0) {
        keywordDensity[kw] = matches.length;
      }
    }

    return res.status(200).json({
      success: true,
      fileName: originalName,
      characterCount: cleanedText.length,
      wordCount,
      estimatedPages,
      totalChunks: chunks.length,
      sections,
      keywordDensity,
      previewSnippet: cleanedText.slice(0, 350) + (cleanedText.length > 350 ? '...' : ''),
      documentFingerprint: Math.random().toString(36).substring(7)
    });

  } catch (error: any) {
    console.error("[InspectDocument Error]:", error);
    return res.status(500).json({ error: `Failed to inspect document: ${error.message}` });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
  }
});

// POST /api/quiz/model-health (Verify configured AI API key)
router.post('/model-health', async (req, res) => {
  const { apiKey } = req.body || {};
  const activeKey = apiKey || req.headers['x-api-key'] || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

  if (!activeKey) {
    return res.status(200).json({
      status: 'offline_ready',
      mode: 'SOVEREIGN_ON_DEVICE',
      message: 'No cloud API key set. Running in 100% Sovereign On-Device Extraction mode.'
    });
  }

  try {
    if (activeKey.startsWith('AIza') || process.env.GEMINI_API_KEY) {
      // Test Gemini key
      const keyToTest = activeKey.startsWith('AIza') ? activeKey : process.env.GEMINI_API_KEY;
      const testRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key=${keyToTest}`,
        { method: 'GET' }
      );
      if (testRes.ok) {
        return res.status(200).json({
          status: 'cloud_active',
          provider: 'Google Gemini',
          model: 'gemini-1.5-flash',
          message: 'Connected to Google Gemini 1.5 Flash API.'
        });
      }
    } else {
      // Test Groq key
      const testRes = await fetch(`https://api.groq.com/openai/v1/models`, {
        headers: { 'Authorization': `Bearer ${activeKey}` }
      });
      if (testRes.ok) {
        return res.status(200).json({
          status: 'cloud_active',
          provider: 'Groq Cloud',
          model: 'llama-3.3-70b-versatile',
          message: 'Connected to Groq Cloud Inference API.'
        });
      }
    }

    return res.status(200).json({
      status: 'fallback_offline',
      mode: 'SOVEREIGN_ON_DEVICE',
      message: 'Cloud API key invalid or unreachable. System safely active in Sovereign On-Device mode.'
    });
  } catch (err: any) {
    return res.status(200).json({
      status: 'fallback_offline',
      mode: 'SOVEREIGN_ON_DEVICE',
      message: 'Network error checking cloud API. Active in Sovereign On-Device mode.'
    });
  }
});

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
