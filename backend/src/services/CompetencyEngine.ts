import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export interface SynthesizedCompetency {
  id: string;
  skillName: string;
  targetLevel: number;
  category: string;
  description: string;
}

/**
 * Dynamically synthesizes an authentic 4-pillar FRAC competency matrix for any arbitrary role.
 */
export function synthesizeDynamicFourPillarCompetencies(designation: string): SynthesizedCompetency[] {
  const norm = designation.toLowerCase().trim();

  // 1. Calibrate target benchmark levels based on seniority keywords
  let baseTargetLevel = 3;
  if (norm.includes('director') || norm.includes('chief') || norm.includes('head') || norm.includes('apex') || norm.includes('commissioner')) {
    baseTargetLevel = 5;
  } else if (norm.includes('senior') || norm.includes('deputy') || norm.includes('assistant') || norm.includes('lead') || norm.includes('specialist') || norm.includes('manager')) {
    baseTargetLevel = 4;
  } else if (norm.includes('junior') || norm.includes('enumerator') || norm.includes('investigator') || norm.includes('intern')) {
    baseTargetLevel = 3;
  }

  // 2. Pillar 1: Statistical Competencies
  let statSkill = 'Survey Design & Sampling Theory';
  let statDesc = 'Probability sampling designs, stratification, and sample variance estimation.';
  if (norm.includes('agri') || norm.includes('crop')) {
    statSkill = 'Agricultural Statistics & Crop Yield Estimation';
    statDesc = 'Area enumeration, crop cutting experiments, and seasonal yield forecasting.';
  } else if (norm.includes('price') || norm.includes('cpi') || norm.includes('inflation') || norm.includes('wpi')) {
    statSkill = 'Price Statistics & Index Number Theory';
    statDesc = 'Laspeyres and Fisher price indices, basket weighting, and inflation nowcasting.';
  } else if (norm.includes('national account') || norm.includes('gdp') || norm.includes('macro') || norm.includes('gva')) {
    statSkill = 'National Accounts & Macro Indices';
    statDesc = 'System of National Accounts (SNA 2008), GVA compilation, and GDP deflators.';
  } else if (norm.includes('gis') || norm.includes('spatial') || norm.includes('geo') || norm.includes('remote')) {
    statSkill = 'Spatial Statistics & Geo-Sampling';
    statDesc = 'Geographical stratification, satellite imagery sampling, and spatial clustering.';
  } else if (norm.includes('social') || norm.includes('demograph') || norm.includes('census') || norm.includes('health')) {
    statSkill = 'Demographic & Social Statistics Modeling';
    statDesc = 'Vital statistics, cohort survival analysis, and social development indicators.';
  } else if (norm.includes('trade') || norm.includes('fiscal') || norm.includes('economic')) {
    statSkill = 'Trade & Economic Statistics Compilation';
    statDesc = 'Balance of payments, customs trade classifications, and high-frequency indices.';
  }

  // 3. Pillar 2: Technical Competencies
  let techSkill = 'Statistical Data Analytics (R & Python)';
  let techDesc = 'Automated microdata cleaning, outlier imputation, and econometric modeling.';
  if (norm.includes('field') || norm.includes('capi') || norm.includes('investigat') || norm.includes('enumerat')) {
    techSkill = 'CAPI & Digital Field Enumeration';
    techDesc = 'Operating Computer-Assisted Personal Interviewing tablets and real-time synchronization.';
  } else if (norm.includes('big data') || norm.includes('cloud') || norm.includes('ai') || norm.includes('ml') || norm.includes('architect')) {
    techSkill = 'Big Data, Cloud & AI/ML Architecture';
    techDesc = 'High-performance computing pipelines, satellite nowcasting, and cloud data lakes.';
  } else if (norm.includes('gis') || norm.includes('spatial') || norm.includes('geo')) {
    techSkill = 'GIS Mapping & Spatial Analytics Tools';
    techDesc = 'QGIS, ArcGIS, and spatial coordinate verification for enumeration areas.';
  } else if (norm.includes('scrutiny') || norm.includes('processing') || norm.includes('tabulat')) {
    techSkill = 'Survey Schedule Scrutiny & Microdata Tabulation';
    techDesc = 'Multi-stage validation rules, consistency checks, and multiplier weighting.';
  }

  // 4. Pillar 3: Digital Governance
  let govSkill = 'Data Privacy & DPDPA 2023 Compliance';
  let govDesc = 'Compliance with Digital Personal Data Protection Act 2023 and informant confidentiality.';
  if (baseTargetLevel >= 5 || norm.includes('cloud') || norm.includes('architect') || norm.includes('sovereign')) {
    govSkill = 'Digital Personal Data Protection & Sovereign Clouds';
    govDesc = 'Sovereign cloud data residency, CERT-In compliance, and enterprise data fiduciary governance.';
  } else if (norm.includes('open') || norm.includes('ndap') || norm.includes('disseminat') || norm.includes('api')) {
    govSkill = 'Digital Public Infrastructure & Open Data (NDAP)';
    govDesc = 'API standards, metadata catalogues, and open government data dissemination.';
  } else if (norm.includes('microdata') || norm.includes('security') || norm.includes('audit')) {
    govSkill = 'Microdata Anonymization & Security Standards';
    govDesc = 'k-anonymity, l-diversity, unit-record masking, and access tier control.';
  }

  // 5. Pillar 4: Behavioural and Managerial
  let behavSkill = 'Public Ethics & Field Communication';
  let behavDesc = 'Engaging respondents with impartiality, minimizing non-response bias, and ethical integrity.';
  if (baseTargetLevel >= 5) {
    behavSkill = 'Strategic Leadership & Change Management';
    behavDesc = 'Civil service transformation under Mission Karmayogi and inter-departmental leadership.';
  } else if (baseTargetLevel === 4) {
    if (norm.includes('policy') || norm.includes('director') || norm.includes('national')) {
      behavSkill = 'Evidence-Based Policy Writing & Cabinet Briefs';
      behavDesc = 'Synthesizing empirical findings into actionable policy recommendations and cabinet memos.';
    } else {
      behavSkill = 'Supervisory Leadership & Quality Audit';
      behavDesc = 'Managing inspection teams, mentoring junior investigators, and ensuring operational rigor.';
    }
  }

  const roleIdPrefix = norm.replace(/[^a-z0-9]/g, '-').slice(0, 15) || 'role';

  return [
    {
      id: `${roleIdPrefix}-stat`,
      skillName: statSkill,
      targetLevel: baseTargetLevel,
      category: 'Statistical Competencies',
      description: statDesc,
    },
    {
      id: `${roleIdPrefix}-tech`,
      skillName: techSkill,
      targetLevel: Math.max(2, baseTargetLevel),
      category: 'Technical Competencies',
      description: techDesc,
    },
    {
      id: `${roleIdPrefix}-gov`,
      skillName: govSkill,
      targetLevel: Math.max(2, baseTargetLevel - (baseTargetLevel === 3 ? 1 : 0)),
      category: 'Digital Governance',
      description: govDesc,
    },
    {
      id: `${roleIdPrefix}-behav`,
      skillName: behavSkill,
      targetLevel: baseTargetLevel,
      category: 'Behavioural and Managerial',
      description: behavDesc,
    },
  ];
}

export class CompetencyEngine {
  /**
   * Role-based skill mapping with automatic failover to verified MoSPI FRAC matrix and dynamic synthesis.
   */
  async getRequiredSkillsForRole(designation: string): Promise<SynthesizedCompetency[]> {
    const normDesignation = (designation || 'Junior Statistical Officer (JSO)').toLowerCase().trim();

    // 1. Attempt Prisma DB lookup if connected
    try {
      const roleMapping: Record<string, string[]> = {
        'joint director': ['Survey Design & Sampling Theory', 'Questionnaire & Instrument Design', 'Non-Sampling Error & Variance Estimation', 'Methodological Research & Policy Direction'],
        'joint director [sdrd] (iss)': ['Survey Design & Sampling Theory', 'Questionnaire & Instrument Design', 'Non-Sampling Error & Variance Estimation', 'Methodological Research & Policy Direction'],
        'deputy director [price statistics] (iss)': ['Price Statistics & Index Number Theory', 'High-Frequency Econometric Modeling', 'Official Dissemination & Data Governance', 'Inter-Ministerial Stakeholder Consultation'],
        'deputy director': ['Price Statistics & Index Number Theory', 'High-Frequency Econometric Modeling', 'Official Dissemination & Data Governance', 'Inter-Ministerial Stakeholder Consultation'],
        'assistant director': ['National Accounts & Macro Indices', 'Time Series & Seasonal Adjustment', 'National Data Governance Framework', 'Evidence-Based Policy Writing'],
        'assistant director (iss)': ['National Accounts & Macro Indices', 'Time Series & Seasonal Adjustment', 'National Data Governance Framework', 'Evidence-Based Policy Writing'],
        'director [diid] (iss)': ['Official Statistics Architecture', 'Big Data, Cloud & AI/ML Architecture', 'Digital Personal Data Protection & Sovereign Clouds', 'Strategic Leadership & Change Management'],
        'director (iss)': ['Official Statistics Architecture', 'Big Data, Cloud & AI/ML Architecture', 'Digital Personal Data Protection & Sovereign Clouds', 'Strategic Leadership & Change Management'],
        'jso': ['Survey Design & Sampling', 'CAPI & Digital Field Enumeration', 'Data Privacy & DPDPA 2023', 'Public Ethics & Field Communication'],
        'junior statistical officer (jso)': ['Survey Design & Sampling', 'CAPI & Digital Field Enumeration', 'Data Privacy & DPDPA 2023', 'Public Ethics & Field Communication'],
        'senior statistical officer (sso)': ['Survey Design & Sampling Weights', 'Statistical Data Analytics (R & Python)', 'Cyber Security & Data Fiduciary', 'Supervisory Leadership & Audit'],
        'sso': ['Survey Design & Sampling Weights', 'Statistical Data Analytics (R & Python)', 'Cyber Security & Data Fiduciary', 'Supervisory Leadership & Audit'],
      };

      const matchedSkills = roleMapping[normDesignation];
      if (matchedSkills) {
        const competencies = await prisma.competency.findMany({
          where: {
            skillName: {
              in: matchedSkills,
            },
          },
        });

        if (competencies && competencies.length > 0) {
          return competencies.map((c: any) => ({
            id: c.id,
            skillName: c.skillName,
            targetLevel: c.targetLevel || 3,
            category: c.category || 'Statistical Competencies',
            description: c.description || '',
          }));
        }
      }
    } catch {
      // Fallback gracefully if Prisma database is not connected
    }

    // 2. Sovereign Local Fallback: Load from mospi_frac_matrix.json
    try {
      const matrixPath = path.join(__dirname, '../data/mospi_frac_matrix.json');
      if (fs.existsSync(matrixPath)) {
        const raw = fs.readFileSync(matrixPath, 'utf-8');
        const data = JSON.parse(raw);
        const matchedCadre = (data.cadres || []).find((c: any) =>
          c.designation?.toLowerCase() === normDesignation ||
          c.id?.toLowerCase() === normDesignation ||
          c.designation?.toLowerCase().includes(normDesignation) ||
          normDesignation.includes(c.designation?.toLowerCase() || '')
        );

        if (matchedCadre && Array.isArray(matchedCadre.competencies) && matchedCadre.competencies.length > 0) {
          return matchedCadre.competencies.map((comp: any) => ({
            id: comp.id,
            skillName: comp.skillName,
            targetLevel: comp.targetLevel || 3,
            category: comp.domain || 'Statistical Competencies',
            description: comp.description || '',
          }));
        }
      }
    } catch (err) {
      console.error('[CompetencyEngine] Matrix reading error:', err);
    }

    // 3. Fully Dynamic 4-Pillar FRAC Synthesis for ANY arbitrary role
    return synthesizeDynamicFourPillarCompetencies(designation);
  }
}
