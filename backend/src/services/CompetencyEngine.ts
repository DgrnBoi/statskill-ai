import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import fs from 'fs';
import path from 'path';

export class CompetencyEngine {
  /**
   * Role-based skill mapping with automatic failover to verified MoSPI FRAC matrix.
   */
  async getRequiredSkillsForRole(designation: string) {
    // 1. Attempt Prisma DB lookup if connected
    try {
      const roleMapping: Record<string, string[]> = {
        'Joint Director': ['Sampling Theory', 'Data Visualization', 'Data Privacy (DPDP)'],
        'Joint Director [SDRD] (ISS)': ['Survey Design & Sampling Theory', 'Questionnaire & Instrument Design', 'Non-Sampling Error & Variance Estimation'],
        'Deputy Director [Price Statistics] (ISS)': ['Price Statistics & Index Number Theory', 'High-Frequency Econometric Modeling', 'Official Dissemination & Data Governance'],
        'Deputy Director': ['Price Statistics & Index Number Theory', 'High-Frequency Econometric Modeling', 'Official Dissemination & Data Governance'],
        'Assistant Director': ['Time Series Analysis', 'Data Visualization'],
        'Assistant Director (ISS)': ['National Accounts & Macro Indices', 'Time Series & Seasonal Adjustment', 'National Data Governance Framework'],
        'Director [DIID] (ISS)': ['Official Statistics Architecture', 'Big Data, Cloud & AI/ML Architecture', 'Digital Personal Data Protection & Sovereign Clouds'],
        'Director (ISS)': ['Official Statistics Architecture', 'Big Data, Cloud & AI/ML Architecture', 'Digital Personal Data Protection & Sovereign Clouds'],
        'JSO': ['Sampling Theory', 'Data Privacy (DPDP)'],
        'Junior Statistical Officer (JSO)': ['Survey Design & Sampling', 'CAPI & Digital Field Enumeration', 'Data Privacy & DPDPA 2023'],
        'Senior Statistical Officer (SSO)': ['Survey Design & Sampling Weights', 'Statistical Data Analytics (R & Python)', 'Cyber Security & Data Fiduciary']
      };

      const requiredSkillNames = roleMapping[designation] || ['Data Privacy & DPDPA 2023'];

      const competencies = await prisma.competency.findMany({
        where: {
          skillName: {
            in: requiredSkillNames
          }
        }
      });

      if (competencies && competencies.length > 0) {
        return competencies;
      }
    } catch (dbErr) {
      console.warn("[CompetencyEngine] Prisma DB unavailable, falling back to local MoSPI FRAC matrix:", (dbErr as Error).message);
    }

    // 2. Sovereign Local Fallback: Load from mospi_frac_matrix.json
    try {
      const matrixPath = path.join(__dirname, '../data/mospi_frac_matrix.json');
      if (fs.existsSync(matrixPath)) {
        const raw = fs.readFileSync(matrixPath, 'utf-8');
        const data = JSON.parse(raw);
        const normDesignation = designation.toLowerCase().trim();
        const matchedCadre = (data.cadres || []).find((c: any) =>
          c.designation?.toLowerCase().includes(normDesignation) ||
          normDesignation.includes(c.designation?.toLowerCase() || '') ||
          c.id?.toLowerCase() === normDesignation
        );

        if (matchedCadre && Array.isArray(matchedCadre.competencies)) {
          return matchedCadre.competencies.map((comp: any) => ({
            id: comp.id,
            skillName: comp.skillName,
            targetLevel: comp.targetLevel || 3,
            category: comp.domain || 'Statistical Competencies',
            description: comp.description || ''
          }));
        }
      }
    } catch (err) {
      console.error("[CompetencyEngine] Fallback reading error:", err);
    }

    // Default emergency fallback
    return [
      { id: 'stat-fallback-1', skillName: 'Survey Design & Sampling', targetLevel: 3, category: 'Statistical Competencies' },
      { id: 'stat-fallback-2', skillName: 'Data Privacy & DPDPA 2023', targetLevel: 2, category: 'Digital Governance' }
    ];
  }
}
