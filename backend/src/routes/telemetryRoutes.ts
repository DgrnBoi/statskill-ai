import express from 'express';
import { TelemetryController } from '../controllers/TelemetryController';

const router = express.Router();
const telemetryController = new TelemetryController();

// POST /api/telemetry/xapi
router.post('/xapi', telemetryController.submitQuizTelemetry);

export default router;
