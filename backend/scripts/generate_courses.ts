import fs from 'fs';
import path from 'path';

const domains = ['Official Statistics', 'Data & Computing', 'Digital Governance & Law', 'Public Administration & Leadership'];
const providers = ['MoSPI Training Unit', 'ISTM', 'MeitY', 'National Statistical Systems Training Academy (NSSTA)', 'Karmayogi Bharat', 'LBSNAA'];

const baseTopics = [
  // Official Statistics
  { title: "Foundations of Statistical Sampling", domain: 0, indic: ["pratichayan", "namuna", "sampling", "survekshan"] },
  { title: "National Accounts and GDP Estimation", domain: 0, indic: ["rashtriya aay", "gdp", "national income"] },
  { title: "Consumer Price Index (CPI) Methodology", domain: 0, indic: ["mudrasphiti", "mahangai", "cpi", "price index"] },
  { title: "Annual Survey of Industries (ASI) Guidelines", domain: 0, indic: ["udyog", "industrial", "asi", "karkhana"] },
  { title: "Agricultural Statistics and Crop Estimation", domain: 0, indic: ["krishi", "kheti", "agriculture", "fasal"] },
  { title: "Survey Design and Stratification", domain: 0, indic: ["survekshan", "design", "stratification"] },
  
  // Data & Computing
  { title: "Python for Data Science", domain: 1, indic: ["python", "data", "programming"] },
  { title: "Advanced R Programming for Statisticians", domain: 1, indic: ["r programming", "statistics computation"] },
  { title: "PowerBI Dashboard Design", domain: 1, indic: ["dashboard", "visual", "powerbi"] },
  { title: "Geospatial Analysis with QGIS", domain: 1, indic: ["gis", "map", "naksha", "geospatial"] },
  { title: "Big Data Processing Techniques", domain: 1, indic: ["big data", "hadoop", "spark"] },
  
  // Digital Governance & Law
  { title: "DPDPA 2023 Compliance for Officers", domain: 2, indic: ["privacy", "data protection", "niyam", "suraksha"] },
  { title: "Right to Information (RTI) Act Masterclass", domain: 2, indic: ["rti", "soochna ka adhikar", "information"] },
  { title: "Cybersecurity Fundamentals for Govt Staff", domain: 2, indic: ["cyber", "security", "suraksha", "hack"] },
  { title: "Public Procurement via GeM Portal", domain: 2, indic: ["gem", "procurement", "khareed", "tender"] },
  
  // Public Administration & Leadership
  { title: "General Financial Rules (GFR) 2017", domain: 3, indic: ["gfr", "vitt", "finance", "rules"] },
  { title: "Ethics in Civil Services", domain: 3, indic: ["naitikta", "ethics", "civil service"] },
  { title: "Office Procedures and Drafting", domain: 3, indic: ["karyalay", "office", "drafting", "file"] },
  { title: "Leadership and Team Management", domain: 3, indic: ["netritva", "leadership", "team", "shikshak"] }
];

const levels = [1, 2, 3, 4, 5];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generatedCourses = [];
let idCounter = 1;

// Generate precisely 700 courses by mixing variations
for (let i = 0; i < 700; i++) {
  const base = getRandomItem(baseTopics);
  const provider = getRandomItem(providers);
  const level = getRandomItem(levels);
  const duration = Math.floor(Math.random() * 20) + 1; // 1 to 20 hours
  
  // Variation to make titles unique
  const prefix = getRandomItem(["", "Advanced ", "Introduction to ", "Masterclass on ", "Applied ", "Workshop: "]);
  const suffix = getRandomItem(["", " for Beginners", " - Level " + level, " in Practice", " (Case Studies)"]);
  
  const title = `${prefix}${base.title}${suffix}`.trim();
  
  generatedCourses.push({
    id: `igot-${String(idCounter).padStart(4, '0')}`,
    title,
    domain: domains[base.domain],
    provider,
    durationHours: duration,
    level,
    competencyMapped: base.title, // For simplicity, map to the base topic
    tags: [domains[base.domain].split(' ')[0].toLowerCase(), ...base.indic.slice(0, 2)],
    keywordsIndic: base.indic
  });
  
  idCounter++;
}

const outputPath = path.join(__dirname, '../src/data/courses_catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(generatedCourses, null, 2));

console.log(`Generated ${generatedCourses.length} courses and saved to ${outputPath}`);
