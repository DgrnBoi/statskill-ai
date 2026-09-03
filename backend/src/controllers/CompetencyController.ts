import { Request, Response } from 'express';
import { CompetencyEngine } from '../services/CompetencyEngine';

const engine = new CompetencyEngine();

export const getRequiredSkills = async (req: Request, res: Response) => {
  try {
    const { designation } = req.query;

    if (!designation || typeof designation !== 'string') {
      return res.status(400).json({ error: 'Designation is required' });
    }

    const competencies = await engine.getRequiredSkillsForRole(designation);
    return res.status(200).json(competencies);
  } catch (error) {
    console.error('Error in getRequiredSkills:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
