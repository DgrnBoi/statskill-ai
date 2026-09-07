import express from 'express';
import { TelemetryController } from '../controllers/TelemetryController';

const router = express.Router();
const telemetryController = new TelemetryController();

// POST /api/telemetry/xapi, /api/telemetry/quiz, and /api/telemetry/submit
router.post('/xapi', telemetryController.submitQuizTelemetry);
router.post('/quiz', telemetryController.submitQuizTelemetry);
router.post('/submit', telemetryController.submitQuizTelemetry);

export default router;
