import { Router } from 'express';
import { getRequiredSkills } from '../controllers/CompetencyController';

const router = Router();

// GET /api/competency or /api/competency/required-skills?designation=Joint%20Director
router.get('/', getRequiredSkills);
router.get('/required-skills', getRequiredSkills);

export default router;
