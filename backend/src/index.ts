import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import competencyRoutes from './routes/competencyRoutes';
import quizRoutes from './routes/quizRoutes';
import telemetryRoutes from './routes/telemetryRoutes';
import recommendRoutes from './routes/recommendRoutes';
import courseRoutes from './routes/courseRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import knowledgeRoutes from './routes/knowledgeRoutes';

import { inputSanitizerMiddleware } from './middlewares/inputSanitizer';
import { globalApiLimiter, quizGenLimiter } from './middlewares/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(inputSanitizerMiddleware);
app.use('/api', globalApiLimiter);

// Register API Routes with rate limiting on intensive generators
app.use('/api/competency', competencyRoutes);
app.use('/api/quiz', quizGenLimiter, quizRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/knowledge', knowledgeRoutes);

app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StatSkill AI Backend Running' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
