import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompetencyEngine {
  /**
   * Mock implementation of role-based skill mapping.
   * In a full system, this would query a matrix table mapping roles to competencies.
   */
  async getRequiredSkillsForRole(designation: string) {
    // For prototype purposes, we map certain roles to specific skills
    const roleMapping: Record<string, string[]> = {
      'Joint Director': ['Sampling Theory', 'Data Visualization', 'Data Privacy (DPDP)'],
      'Assistant Director': ['Time Series Analysis', 'Data Visualization'],
      'JSO': ['Sampling Theory', 'Data Privacy (DPDP)']
    };

    const requiredSkillNames = roleMapping[designation] || ['Data Privacy (DPDP)'];

    // Fetch the detailed competency requirements from DB
    const competencies = await prisma.competency.findMany({
      where: {
        skillName: {
          in: requiredSkillNames
        }
      }
    });

    return competencies;
  }
}
