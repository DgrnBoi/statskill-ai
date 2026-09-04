// Local In-Memory Semantic Course Matcher
// Avoids external dependencies like Pinecone to guarantee 100% offline reliability.

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  link: string;
  keywords: string[];
}

const IGOT_CATALOG: Course[] = [
  {
    id: "igot-101",
    title: "Foundations of Statistical Sampling",
    provider: "MoSPI Training Unit",
    duration: "4 Hours",
    link: "https://igot.karmayogi.gov.in/courses/mospi-sampling",
    keywords: ["sampling", "stratification", "nsso", "survey", "design", "fsu", "village", "multi-stage"]
  },
  {
    id: "igot-102",
    title: "Consumer Price Index (CPI) Methodology",
    provider: "ISTM",
    duration: "6 Hours",
    link: "https://igot.karmayogi.gov.in/courses/cpi-index",
    keywords: ["cpi", "inflation", "index", "laspeyres", "base-year", "price", "basket"]
  },
  {
    id: "igot-103",
    title: "DPDPA Compliance for Statistical Officers",
    provider: "Ministry of Electronics and IT",
    duration: "3 Hours",
    link: "https://igot.karmayogi.gov.in/courses/dpdpa-privacy",
    keywords: ["dpdpa", "privacy", "fiduciary", "principal", "consent", "data", "anonymization", "security"]
  },
  {
    id: "igot-104",
    title: "Advanced Time Series Analysis",
    provider: "MoSPI Training Unit",
    duration: "10 Hours",
    link: "https://igot.karmayogi.gov.in/courses/time-series",
    keywords: ["time", "series", "forecasting", "arima", "seasonality", "trend", "gdp"]
  }
];

/**
 * Calculates a simple Jaccard/TF-IDF style overlap score for semantic matching
 * (In a full prod environment, we would use transformers.js for actual vector dot-products)
 */
function calculateSimilarity(gapDescription: string, courseKeywords: string[]): number {
  if (!gapDescription || typeof gapDescription !== 'string') return 0;
  if (!courseKeywords || !Array.isArray(courseKeywords) || courseKeywords.length === 0) return 0;

  const gapWords = gapDescription.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  let score = 0;
  
  for (const keyword of courseKeywords) {
    if (!keyword) continue;
    const lowerKeyword = keyword.toLowerCase();
    if (gapWords.includes(lowerKeyword)) {
      score += 1.5; // Exact match
    } else {
      // Partial match
      for (const word of gapWords) {
        if (word.length > 3 && lowerKeyword.includes(word)) {
          score += 0.5;
        }
      }
    }
  }
  
  return score;
}

export class CourseMatcherService {
  /**
   * Semantically matches a failed topic to the best iGOT course.
   */
  async recommendCourse(gapTopic?: string, gapDescription?: string): Promise<Course> {
    const query = `${gapTopic || ''} ${gapDescription || ''}`.trim();
    
    let bestCourse = IGOT_CATALOG[0];
    let highestScore = -1;

    for (const course of IGOT_CATALOG) {
      const score = calculateSimilarity(query, course.keywords);
      if (score > highestScore) {
        highestScore = score;
        bestCourse = course;
      }
    }

    // Default to a general course if no specific match is found
    if (highestScore === 0) {
      return IGOT_CATALOG[0];
    }

    return bestCourse;
  }
}
