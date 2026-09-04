import fs from 'fs';
import path from 'path';

export interface Course {
  id: string;
  title: string;
  domain: string;
  provider: string;
  durationHours: number;
  level: number;
  competencyMapped: string;
  tags: string[];
  keywordsIndic: string[];
}

export class MultilingualSearchService {
  private courses: Course[] = [];

  constructor() {
    this.loadCatalog();
  }

  private loadCatalog() {
    try {
      const dataPath = path.join(__dirname, '../../data/courses_catalog.json');
      const data = fs.readFileSync(dataPath, 'utf-8');
      this.courses = JSON.parse(data);
      console.log(`[Search Engine] Loaded ${this.courses.length} courses into memory.`);
    } catch (err) {
      console.error("[Search Engine] Failed to load catalog:", err);
    }
  }

  /**
   * Explodes the search query to include phonetic and cross-lingual mappings.
   * Emulates Bhashini NLP behavior for low-resource environments.
   */
  private expandQuery(query: string): string[] {
    const tokens = query.toLowerCase().trim().split(/\s+/);
    const expanded = new Set<string>();

    // Bhashini-aligned mapping dictionary
    const dictionary: Record<string, string[]> = {
      "shikshak": ["teacher", "trainer", "leadership", "team"],
      "शिक्षक": ["teacher", "trainer", "leadership", "team"],
      "pratichayan": ["sampling", "survey", "design"],
      "प्रतिचयन": ["sampling", "survey", "design"],
      "mudrasphiti": ["cpi", "inflation", "price"],
      "मुद्रास्फीति": ["cpi", "inflation", "price"],
      "karyalay": ["office", "administration", "drafting"],
      "कार्यालय": ["office", "administration", "drafting"],
      "naitikta": ["ethics", "civil service"],
      "rashtriya": ["national", "gdp"],
      "krishi": ["agriculture", "crop"],
      "soochna": ["rti", "information"],
      "suraksha": ["security", "cyber", "protection"]
    };

    tokens.forEach(token => {
      expanded.add(token);
      if (dictionary[token]) {
        dictionary[token].forEach(syn => expanded.add(syn));
      }
    });

    return Array.from(expanded);
  }

  /**
   * Scores a course against the expanded query tokens.
   */
  private scoreCourse(course: Course, queryTokens: string[]): number {
    let score = 0;
    const title = (course.title || '').toLowerCase();
    const domain = (course.domain || '').toLowerCase();
    const tags = (course.tags || []).map(t => (t ? t.toLowerCase() : ''));
    const keywordsIndic = (course.keywordsIndic || []).map(k => (k ? k.toLowerCase() : ''));

    const searchSpace = [
      title,
      domain,
      ...tags,
      ...keywordsIndic
    ].join(' ');

    for (const token of queryTokens) {
      if (searchSpace.includes(token)) {
        // Boost score if it's in the title
        if (title.includes(token)) {
          score += 3;
        } else if (keywordsIndic.includes(token)) {
          score += 2; // High weight for Indic keyword matches
        } else {
          score += 1;
        }
      }
    }
    return score;
  }

  public search(query: string, domainFilter?: string, levelFilter?: number): Course[] {
    const start = performance.now();
    let results = this.courses;

    // 1. Hard Filtering
    if (domainFilter && domainFilter !== 'All') {
      const dFilterLower = domainFilter.toLowerCase();
      results = results.filter(c => {
        const cDomain = (c.domain || '').toLowerCase();
        return cDomain === dFilterLower || cDomain.includes(dFilterLower) || dFilterLower.includes(cDomain);
      });
    }
    if (levelFilter && levelFilter > 0) {
      results = results.filter(c => c.level === levelFilter);
    }

    // 2. Semantic/Keyword Scoring
    if (query && query.trim() !== '') {
      const expandedTokens = this.expandQuery(query);
      const scored = results.map(c => ({
        course: c,
        score: this.scoreCourse(c, expandedTokens)
      }));

      // Filter out zero scores and sort by descending score
      results = scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(s => s.course);
    }

    const duration = performance.now() - start;
    console.log(`[Search Engine] Query "${query}" matched ${results.length} courses in ${duration.toFixed(2)}ms.`);
    
    // Return top 20 max to save bandwidth
    return results.slice(0, 20);
  }
}
