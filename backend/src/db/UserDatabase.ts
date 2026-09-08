import fs from 'fs';
import path from 'path';

export interface UserAssessmentRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  score: number;
  totalScore: number;
  scorePercentage: number;
  status: 'passed' | 'remedial';
  durationMinutes: number;
  date: string;
  misconceptions?: Array<{
    question: string;
    chosenAnswer: string;
    correctAnswer: string;
    misconception: string;
    remedialCourse: string;
    remedialCourseId: string;
    remedialSkill: string;
  }>;
}

export interface UserRecord {
  id: string;
  parichayId: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  division: string;
  cadre: string;
  location: string;
  experienceYears: number;
  proficiency: Record<string, number>;
  assessmentHistory: UserAssessmentRecord[];
  enrolledCourses: string[];
  createdAt: string;
  updatedAt: string;
}

const INITIAL_SEEDED_USERS: UserRecord[] = [
  {
    id: 'usr_1042',
    parichayId: 'PARICHAY_1042_NSSO',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@mospi.gov.in',
    mobile: '9876543210',
    designation: 'Junior Statistical Officer (JSO)',
    division: 'Field Operations Division (FOD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
    location: 'Navi Mumbai',
    experienceYears: 2,
    proficiency: {
      'Survey Design & Sampling': 3,
      'CAPI & Digital Field Enumeration': 3,
      'Data Privacy & DPDPA 2023': 2,
      'Public Ethics & Field Communication': 3,
    },
    assessmentHistory: [
      {
        id: 'eval-1042-01',
        courseId: 'Survey Design and Stratification',
        courseTitle: 'NSSO Multistage Stratified Sampling Masterclass',
        category: 'Statistical Competencies',
        score: 80,
        totalScore: 100,
        scorePercentage: 80,
        status: 'passed',
        durationMinutes: 12,
        date: '2026-09-05',
      },
    ],
    enrolledCourses: ['igot-surv-01', 'nssta-stat-02'],
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-09-05T14:30:00.000Z',
  },
  {
    id: 'usr_2088',
    parichayId: 'PARICHAY_2088_NSSO',
    name: 'Ananya Mehta',
    email: 'ananya.mehta@mospi.gov.in',
    mobile: '9876543211',
    designation: 'Senior Statistical Officer (SSO)',
    division: 'Data Processing Division (DPD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
    location: 'Kolkata',
    experienceYears: 6,
    proficiency: {
      'Survey Design & Sampling Weights': 4,
      'Statistical Data Analytics (R & Python)': 3,
      'Cyber Security & Data Fiduciary': 3,
      'Supervisory Leadership & Audit': 4,
    },
    assessmentHistory: [
      {
        id: 'eval-2088-01',
        courseId: 'Microdata Processing and Tabulation',
        courseTitle: 'Automated Microdata Cleaning & Anonymization Pipelines',
        category: 'Technical Competencies',
        score: 85,
        totalScore: 100,
        scorePercentage: 85,
        status: 'passed',
        durationMinutes: 15,
        date: '2026-09-04',
      },
    ],
    enrolledCourses: ['igot-tech-04'],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-09-04T11:00:00.000Z',
  },
  {
    id: 'usr_3612',
    parichayId: 'PARICHAY_3612_ISS',
    name: 'Rohan Iyer',
    email: 'rohan.iyer@mospi.gov.in',
    mobile: '9876543212',
    designation: 'Assistant Director (ISS)',
    division: 'National Accounts Division (NAD)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 4,
    proficiency: {
      'National Accounts & Macro Indices': 4,
      'Time Series & Seasonal Adjustment': 4,
      'National Data Governance Framework': 3,
      'Evidence-Based Policy Writing': 4,
    },
    assessmentHistory: [],
    enrolledCourses: ['nssta-nad-01'],
    createdAt: '2026-02-01T09:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'usr_4820',
    parichayId: 'PARICHAY_4820_ISS',
    name: 'Kavita Rao',
    email: 'kavita.rao@mospi.gov.in',
    mobile: '9876543213',
    designation: 'Director (ISS)',
    division: 'Data Informatics & Innovation Division (DIID)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 14,
    proficiency: {
      'Official Statistics Architecture': 5,
      'Big Data, Cloud & AI/ML Architecture': 5,
      'Digital Personal Data Protection & Sovereign Clouds': 5,
      'Strategic Leadership & Change Management': 5,
    },
    assessmentHistory: [],
    enrolledCourses: ['igot-gov-01'],
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z',
  },
  {
    id: 'usr_5914',
    parichayId: 'PARICHAY_5914_ISS',
    name: 'Dr. Rajeshwari Nair',
    email: 'rajeshwari.nair@mospi.gov.in',
    mobile: '9876543214',
    designation: 'Joint Director [SDRD] (ISS)',
    division: 'Survey Design & Research Division (SDRD), NSSO',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'Kolkata',
    experienceYears: 11,
    proficiency: {
      'Survey Design & Sampling Theory': 5,
      'Questionnaire & Instrument Design': 4,
      'Non-Sampling Error & Variance Estimation': 5,
      'Methodological Research & Policy Direction': 5,
    },
    assessmentHistory: [],
    enrolledCourses: ['nssta-stat-01'],
    createdAt: '2026-01-12T09:00:00.000Z',
    updatedAt: '2026-09-03T12:00:00.000Z',
  },
  {
    id: 'usr_6120',
    parichayId: 'PARICHAY_6120_ISS',
    name: 'Dr. Vikram Seth',
    email: 'vikram.seth@mospi.gov.in',
    mobile: '9876543215',
    designation: 'Deputy Director [Price Statistics] (ISS)',
    division: 'Economic Statistics Division (ESD), MoSPI',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 8,
    proficiency: {
      'Price Statistics & Index Number Theory': 4,
      'High-Frequency Econometric Modeling': 4,
      'Official Dissemination & Data Governance': 4,
      'Inter-Ministerial Stakeholder Consultation': 4,
    },
    assessmentHistory: [],
    enrolledCourses: ['nssta-price-01'],
    createdAt: '2026-02-10T09:00:00.000Z',
    updatedAt: '2026-09-04T15:00:00.000Z',
  },
  {
    id: 'usr_7145',
    parichayId: 'PARICHAY_7145_ISS',
    name: 'Sunita Deshpande',
    email: 'sunita.deshpande@mospi.gov.in',
    mobile: '9876543216',
    designation: 'Director [Training] (ISS)',
    division: 'National Statistical Systems Training Academy (NSSTA)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'Greater Noida',
    experienceYears: 15,
    proficiency: {
      'Official Statistics Architecture': 5,
      'Curriculum Design & CBC Standards': 5,
      'Statistical Capacity Diagnostics': 5,
      'Strategic Leadership & Change Management': 5,
    },
    assessmentHistory: [],
    enrolledCourses: ['nssta-stat-01', 'nssta-nad-01'],
    createdAt: '2026-01-08T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'usr_8230',
    parichayId: 'PARICHAY_8230_ISS',
    name: 'Arvind Swaminathan',
    email: 'arvind.swaminathan@mospi.gov.in',
    mobile: '9876543217',
    designation: 'Assistant Director [Environment Statistics] (ISS)',
    division: 'Economic Statistics Division (ESD), MoSPI',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'Bengaluru',
    experienceYears: 5,
    proficiency: {
      'Environmental Economic Accounting (SEEA)': 4,
      'Energy Statistics & Balance Sheets': 3,
      'Geospatial Statistical Integration': 4,
      'Evidence-Based Policy Writing': 3,
    },
    assessmentHistory: [],
    enrolledCourses: ['nssta-stat-02'],
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-09-02T14:00:00.000Z',
  },
  {
    id: 'usr_9312',
    parichayId: 'PARICHAY_9312_NSSO',
    name: 'Meera Sengupta',
    email: 'meera.sengupta@mospi.gov.in',
    mobile: '9876543218',
    designation: 'Junior Statistical Officer (JSO)',
    division: 'Field Operations Division (FOD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
    location: 'Guwahati',
    experienceYears: 1,
    proficiency: {
      'Survey Design & Sampling': 2,
      'CAPI & Digital Field Enumeration': 3,
      'Data Privacy & DPDPA 2023': 2,
      'Public Ethics & Field Communication': 2,
    },
    assessmentHistory: [],
    enrolledCourses: ['igot-surv-01'],
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'usr_1045',
    parichayId: 'PARICHAY_1045_NSSO',
    name: 'Tarun Banerjee',
    email: 'tarun.banerjee@mospi.gov.in',
    mobile: '9876543219',
    designation: 'Senior Statistical Officer (SSO)',
    division: 'Data Processing Division (DPD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
    location: 'Kolkata',
    experienceYears: 7,
    proficiency: {
      'Survey Design & Sampling Weights': 4,
      'Statistical Data Analytics (R & Python)': 4,
      'Cyber Security & Data Fiduciary': 3,
      'Supervisory Leadership & Audit': 3,
    },
    assessmentHistory: [],
    enrolledCourses: ['igot-tech-04'],
    createdAt: '2026-01-20T09:00:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
  },
  {
    id: 'usr_2190',
    parichayId: 'PARICHAY_2190_ISS',
    name: 'Dr. Fatima Sheikh',
    email: 'fatima.sheikh@mospi.gov.in',
    mobile: '9876543220',
    designation: 'Joint Director [Economic Census] (ISS)',
    division: 'Data Informatics & Innovation Division (DIID)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'Hyderabad',
    experienceYears: 12,
    proficiency: {
      'Official Statistics Architecture': 5,
      'Enterprise Register & Business Statistics': 5,
      'Big Data, Cloud & AI/ML Architecture': 4,
      'Strategic Leadership & Change Management': 4,
    },
    assessmentHistory: [],
    enrolledCourses: ['igot-gov-01'],
    createdAt: '2026-01-18T09:00:00.000Z',
    updatedAt: '2026-09-02T13:00:00.000Z',
  },
  {
    id: 'usr_3310',
    parichayId: 'PARICHAY_3310_NSSO',
    name: 'Harpreet Singh',
    email: 'harpreet.singh@mospi.gov.in',
    mobile: '9876543221',
    designation: 'Junior Statistical Officer (JSO)',
    division: 'Field Operations Division (FOD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
    location: 'Chandigarh',
    experienceYears: 3,
    proficiency: {
      'Survey Design & Sampling': 3,
      'CAPI & Digital Field Enumeration': 4,
      'Data Privacy & DPDPA 2023': 3,
      'Public Ethics & Field Communication': 3,
    },
    assessmentHistory: [],
    enrolledCourses: ['igot-surv-01'],
    createdAt: '2026-02-05T09:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
];

export class UserDatabase {
  private static instance: UserDatabase;
  private users: Map<string, UserRecord> = new Map();

  private constructor() {
    this.seedInitialUsers();
  }

  public static getInstance(): UserDatabase {
    if (!UserDatabase.instance) {
      UserDatabase.instance = new UserDatabase();
    }
    return UserDatabase.instance;
  }

  private seedInitialUsers(): void {
    this.users.clear();
    for (const u of INITIAL_SEEDED_USERS) {
      this.users.set(u.id, { ...u, proficiency: { ...u.proficiency }, assessmentHistory: [...u.assessmentHistory], enrolledCourses: [...u.enrolledCourses] });
    }
  }

  public resetDatabase(): void {
    this.seedInitialUsers();
  }

  public getAllUsers(query?: { division?: string; cadre?: string; search?: string }): UserRecord[] {
    let list = Array.from(this.users.values());

    if (query?.division && query.division !== 'All') {
      const normDiv = query.division.toLowerCase();
      list = list.filter((u) => u.division.toLowerCase().includes(normDiv));
    }

    if (query?.cadre && query.cadre !== 'All') {
      const normCadre = query.cadre.toLowerCase();
      list = list.filter((u) => u.cadre.toLowerCase().includes(normCadre));
    }

    if (query?.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.designation.toLowerCase().includes(q) ||
          u.parichayId.toLowerCase().includes(q) ||
          u.division.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q)
      );
    }

    return list.map((u) => ({ ...u, proficiency: { ...u.proficiency }, assessmentHistory: [...u.assessmentHistory] }));
  }

  public getUserById(id: string): UserRecord | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    return { ...user, proficiency: { ...user.proficiency }, assessmentHistory: [...user.assessmentHistory] };
  }

  public getUserByParichayId(parichayId: string): UserRecord | undefined {
    const norm = parichayId.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.parichayId.trim().toLowerCase() === norm) {
        return { ...u, proficiency: { ...u.proficiency }, assessmentHistory: [...u.assessmentHistory] };
      }
    }
    return undefined;
  }

  public getUserByEmail(email: string): UserRecord | undefined {
    const norm = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.trim().toLowerCase() === norm) {
        return { ...u, proficiency: { ...u.proficiency }, assessmentHistory: [...u.assessmentHistory] };
      }
    }
    return undefined;
  }

  public getUserByMobile(mobile: string): UserRecord | undefined {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    for (const u of this.users.values()) {
      if (u.mobile.replace(/[^0-9]/g, '') === cleanMobile) {
        return { ...u, proficiency: { ...u.proficiency }, assessmentHistory: [...u.assessmentHistory] };
      }
    }
    return undefined;
  }

  public registerUser(payload: Partial<UserRecord>): UserRecord {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = payload.id || `usr_${randomSuffix}`;
    const name = payload.name?.trim() || 'Statistical Officer';
    const designation = payload.designation?.trim() || 'Junior Statistical Officer (JSO)';
    const division = payload.division?.trim() || 'Field Operations Division (FOD), NSSO';
    const cadre = payload.cadre?.trim() || (designation.includes('ISS') ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)');
    const parichayId = payload.parichayId?.trim() || `PARICHAY_${randomSuffix}_${cadre.includes('ISS') ? 'ISS' : 'NSSO'}`;
    const email = payload.email?.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@mospi.gov.in`;
    const mobile = payload.mobile?.trim() || `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const location = payload.location?.trim() || 'New Delhi';
    const experienceYears = typeof payload.experienceYears === 'number' ? payload.experienceYears : 3;

    // Default initial proficiencies based on designation
    const defaultProf: Record<string, number> = payload.proficiency || {
      'Survey Design & Sampling': designation.includes('Director') ? 4 : 2,
      'CAPI & Digital Field Enumeration': designation.includes('Director') ? 4 : 3,
      'Data Privacy & DPDPA 2023': 2,
      'Public Ethics & Field Communication': 3,
    };

    const now = new Date().toISOString();
    const newUser: UserRecord = {
      id,
      parichayId,
      name,
      email,
      mobile,
      designation,
      division,
      cadre,
      location,
      experienceYears,
      proficiency: defaultProf,
      assessmentHistory: payload.assessmentHistory || [],
      enrolledCourses: payload.enrolledCourses || [],
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, newUser);
    return { ...newUser, proficiency: { ...newUser.proficiency } };
  }

  public updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated: UserRecord = {
      ...existing,
      ...updates,
      proficiency: updates.proficiency ? { ...existing.proficiency, ...updates.proficiency } : existing.proficiency,
      assessmentHistory: updates.assessmentHistory ? [...updates.assessmentHistory] : existing.assessmentHistory,
      enrolledCourses: updates.enrolledCourses ? [...updates.enrolledCourses] : existing.enrolledCourses,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updated);
    return { ...updated, proficiency: { ...updated.proficiency } };
  }

  public recordAssessment(userId: string, assessment: UserAssessmentRecord): UserRecord | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const newHistory = [assessment, ...user.assessmentHistory];
    const updatedUser: UserRecord = {
      ...user,
      assessmentHistory: newHistory,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, updatedUser);
    return { ...updatedUser, proficiency: { ...updatedUser.proficiency }, assessmentHistory: [...newHistory] };
  }
}

export const userDb = UserDatabase.getInstance();
