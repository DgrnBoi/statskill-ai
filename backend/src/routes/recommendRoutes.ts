import express from 'express';
import { CourseMatcherService } from '../services/recommendation/CourseMatcher';

const router = express.Router();
const courseMatcher = new CourseMatcherService();

// POST /api/recommend/course - Single Question / Topic Gap Matcher
router.post('/course', async (req, res) => {
  try {
    const { gapTopic, gapDescription, assessedLevel } = req.body;
    
    if (!gapTopic && !gapDescription) {
      return res.status(400).json({ error: 'Either gapTopic or gapDescription is required.' });
    }

    const recommendation = await courseMatcher.recommendCourse(
      gapTopic,
      gapDescription,
      typeof assessedLevel === 'number' ? assessedLevel : 2
    );
    
    return res.status(200).json({
      success: true,
      recommendation,
    });
  } catch (error: any) {
    console.error('Recommendation Error:', error);
    return res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
});

// POST /api/recommend/analyze-assessment - Cognitive Misconception & Diagnostic Recommendation Engine
router.post('/analyze-assessment', async (req, res) => {
  try {
    const { officerId, cadre, answers, proficiencies } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers array is required for diagnostic assessment analysis.' });
    }

    const analysis = await courseMatcher.analyzeAssessmentResults(
      officerId || 'JSO_1042',
      cadre || 'Junior Statistical Officer (JSO)',
      answers,
      proficiencies || {}
    );

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Assessment Analysis Error:', error);
    return res.status(500).json({ error: 'Failed to analyze assessment and compute diagnostic recommendations.' });
  }
});

// POST /api/recommend/pathway - 4-Tier Zone of Proximal Development (ZPD) Pathway
router.post('/pathway', async (req, res) => {
  try {
    const { designation, proficiencies } = req.body;

    const targetCadre = designation || 'Junior Statistical Officer (JSO)';
    const userProficiencies = (proficiencies && typeof proficiencies === 'object') ? proficiencies : {};

    const pathway = await courseMatcher.generatePersonalisedPathway(targetCadre, userProficiencies);

    return res.status(200).json({
      success: true,
      pathway,
    });
  } catch (error: any) {
    console.error('Pathway Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate personalised learning pathway.' });
  }
});

// GET /api/recommend/pathway - Quick preview endpoint for testing / browser inspections
router.get('/pathway', async (req, res) => {
  try {
    const designation = (req.query.cadre as string) || 'Junior Statistical Officer (JSO)';
    const pathway = await courseMatcher.generatePersonalisedPathway(designation, {});

    return res.status(200).json({
      success: true,
      pathway,
    });
  } catch (error: any) {
    console.error('Pathway GET Error:', error);
    return res.status(500).json({ error: 'Failed to generate preview pathway.' });
  }
});

// GET /api/recommend/clusters - List all mapped progression clusters
router.get('/clusters', (req, res) => {
  try {
    const data = courseMatcher.getProgressionClusters();
    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error('Cluster GET Error:', error);
    return res.status(500).json({ error: 'Failed to fetch progression clusters.' });
  }
});

// GET /api/recommend/clusters/:clusterId - Get course progression chain for a cluster
router.get('/clusters/:clusterId', (req, res) => {
  try {
    const { clusterId } = req.params;
    const { cluster, courses } = courseMatcher.getClusterCourses(clusterId);
    if (!cluster && courses.length === 0) {
      return res.status(404).json({ error: `Cluster '${clusterId}' not found.` });
    }
    return res.status(200).json({
      success: true,
      cluster,
      totalCourses: courses.length,
      courses,
    });
  } catch (error: any) {
    console.error('Cluster Course GET Error:', error);
    return res.status(500).json({ error: 'Failed to fetch cluster courses.' });
  }
});

// GET /api/recommend/progression/:courseId - Get progression info (prereqs, next steps) for a specific course
router.get('/progression/:courseId', (req, res) => {
  try {
    const { courseId } = req.params;
    const progression = courseMatcher.getCourseProgression(courseId);
    if (!progression) {
      return res.status(404).json({ error: `Progression mapping for course '${courseId}' not found.` });
    }
    return res.status(200).json({
      success: true,
      progression,
    });
  } catch (error: any) {
    console.error('Course Progression GET Error:', error);
    return res.status(500).json({ error: 'Failed to fetch course progression.' });
  }
});

export default router;

