import fs from 'fs';
import path from 'path';
import express from 'express';

const router = express.Router();

function getCircularsData(): any[] {
  try {
    const filePath = path.join(__dirname, '../data/amrit_gyaan_kosh.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[KnowledgeRoutes] Error reading circulars data:', err);
  }
  return [];
}

// GET /api/knowledge - List all circulars
router.get('/', (_req, res) => {
  const circulars = getCircularsData();
  return res.status(200).json(circulars);
});

// GET /api/knowledge/:id - Get circular by ID with full content
router.get('/:id', (req, res) => {
  const circulars = getCircularsData();
  const circular = circulars.find((c) => c.id === req.params.id);
  if (!circular) {
    return res.status(404).json({ error: 'Circular not found in Amrit Gyaan Kosh' });
  }
  return res.status(200).json(circular);
});

export default router;
