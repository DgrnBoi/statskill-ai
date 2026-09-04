import express from 'express';
import { MultilingualSearchService } from '../services/search/MultilingualSearch';

const router = express.Router();
const searchService = new MultilingualSearchService();

// GET /api/courses/search?q=...&domain=...&level=...
router.get('/search', (req, res) => {
  try {
    const query = req.query.q as string || '';
    const domain = req.query.domain as string;
    const levelStr = req.query.level as string;
    const level = levelStr ? parseInt(levelStr) : undefined;

    const results = searchService.search(query, domain, level);
    
    return res.status(200).json({
      success: true,
      count: results.length,
      courses: results
    });
  } catch (error: any) {
    console.error('Course Search Error:', error);
    return res.status(500).json({ error: 'Failed to perform search.' });
  }
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  try {
    const courseId = req.params.id;
    const course = searchService.getById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course with id '${courseId}' was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      course
    });
  } catch (error: any) {
    console.error('Course Detail Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve course details.'
    });
  }
});

export default router;
