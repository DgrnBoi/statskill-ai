import express from 'express';
import { TelemetryController } from '../controllers/TelemetryController';

const router = express.Router();
const telemetryController = new TelemetryController();

// POST /api/telemetry/xapi and /api/telemetry/quiz
router.post('/xapi', telemetryController.submitQuizTelemetry);
router.post('/quiz', telemetryController.submitQuizTelemetry);

export default router;
