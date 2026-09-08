import express from 'express';
import fs from 'fs';
import path from 'path';
import { resolveDataPath } from '../utils/dataPath';

const router = express.Router();

interface DivisionData {
  ministry: string;
  headquarters: string;
  cadreControllingAuthority: string;
  totalCadreStrength: number;
  systemReadinessScore: number;
  acbpComplianceScore: number;
  lastAuditDate: string;
  divisions: Array<{
    id: string;
    code: string;
    name: string;
    mandate: string;
    headquarters: string;
    totalOfficers: number;
    readinessScore: number;
    domainScores: Record<string, number>;
    criticalBottlenecks: string[];
    priorityCourses: Array<{
      courseId: string;
      title: string;
      provider: string;
      targetOfficers: number;
      duration: string;
    }>;
  }>;
  regionalCircles: Array<{
    circle: string;
    headcount: number;
    readiness: number;
  }>;
}

function loadDivisionsData(): DivisionData {
  const filePath = resolveDataPath('mospi_divisions.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }
  throw new Error('Divisions data file not found');
}

/**
 * GET /api/admin/divisions
 * Returns aggregated workforce and division readiness metrics across MoSPI
 */
router.get('/divisions', (req, res) => {
  try {
    const data = loadDivisionsData();
    return res.status(200).json({
      success: true,
      ministry: data.ministry,
      totalCadreStrength: data.totalCadreStrength,
      systemReadinessScore: data.systemReadinessScore,
      acbpComplianceScore: data.acbpComplianceScore,
      divisions: data.divisions,
      regionalCircles: data.regionalCircles
    });
  } catch (error: any) {
    console.error('Admin divisions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load MoSPI division analytics.'
    });
  }
});

/**
 * GET /api/admin/acbp-dossier
 * Generates an official Annual Capacity Building Plan (ACBP) Dossier for CBC audit
 */
router.get('/acbp-dossier', (req, res) => {
  try {
    const data = loadDivisionsData();
    const timestamp = new Date().toISOString();

    const dossier = {
      documentId: `ACBP-MoSPI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ministry: data.ministry,
      authority: "National Statistical Systems Training Academy (NSSTA) & Capacity Building Commission (CBC)",
      generatedAt: timestamp,
      fiscalYear: "2026-2027",
      executiveSummary: {
        totalStatisticalCadreTracked: data.totalCadreStrength,
        overallSystemReadiness: `${data.systemReadinessScore}%`,
        acbpFulfillmentRate: `${data.acbpComplianceScore}%`,
        status: "Compliant with Mission Karmayogi National Competency Framework"
      },
      divisionAllocations: data.divisions.map(div => ({
        divisionName: div.name,
        officersCovered: div.totalOfficers,
        readinessLevel: `${div.readinessScore}%`,
        identifiedGaps: div.criticalBottlenecks,
        recommendedInterventions: div.priorityCourses
      })),
      regionalEquity: data.regionalCircles,
      statutoryCompliance: {
        dpdpa2023: "Mandatory Data Fiduciary Certification Enforced",
        collectionOfStatisticsAct: "Standardized Enumeration Protocols Active",
        xApiLrsEndpoint: "https://igotkarmayogi.gov.in/lrs/v1/statements"
      }
    };

    return res.status(200).json({
      success: true,
      dossier
    });
  } catch (error: any) {
    console.error('ACBP dossier generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to synthesize ACBP Dossier.'
    });
  }
});

export default router;
