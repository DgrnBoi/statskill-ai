import { Router } from 'express';
import { getRequiredSkills } from '../controllers/CompetencyController';

const router = Router();

// GET /api/competency/required-skills?designation=Joint%20Director
router.get('/required-skills', getRequiredSkills);

export default router;
