import express from 'express';
import { CourseMatcherService } from '../services/recommendation/CourseMatcher';

const router = express.Router();
const courseMatcher = new CourseMatcherService();

// POST /api/recommend/course
router.post('/course', async (req, res) => {
  try {
    const { gapTopic, gapDescription } = req.body;
    
    if (!gapTopic || !gapDescription) {
      return res.status(400).json({ error: 'gapTopic and gapDescription are required.' });
    }

    const recommendation = await courseMatcher.recommendCourse(gapTopic, gapDescription);
    
    return res.status(200).json({
      success: true,
      recommendation
    });
  } catch (error: any) {
    console.error('Recommendation Error:', error);
    return res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
});

export default router;
