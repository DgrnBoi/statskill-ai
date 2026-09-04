import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import competencyRoutes from './routes/competencyRoutes';
import quizRoutes from './routes/quizRoutes';
import telemetryRoutes from './routes/telemetryRoutes';
import recommendRoutes from './routes/recommendRoutes';
import courseRoutes from './routes/courseRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/competency', competencyRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StatSkill AI Backend Running' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
