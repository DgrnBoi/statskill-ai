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

export const SAMPLE_DEMO_USERS: UserRecord[] = [
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
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
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
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
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
    division: 'National Accounts Division (NAD), CSO',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 4,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2026-01-08T09:00:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
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
    location: 'Kolkata',
    experienceYears: 12,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-11-20T09:00:00.000Z',
    updatedAt: '2026-09-02T11:00:00.000Z',
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
    location: 'New Delhi',
    experienceYears: 16,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: '2026-09-01T11:00:00.000Z',
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
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-10-10T09:00:00.000Z',
    updatedAt: '2026-08-28T11:00:00.000Z',
  },
  {
    id: 'usr_7015',
    parichayId: 'PARICHAY_7015_NSSTA',
    name: 'Sunita Agarwal',
    email: 'sunita.agarwal@mospi.gov.in',
    mobile: '9876543216',
    designation: 'Faculty & Senior Officer',
    division: 'National Statistical Systems Training Academy (NSSTA)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'Greater Noida',
    experienceYears: 10,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-09-12T09:00:00.000Z',
    updatedAt: '2026-08-20T11:00:00.000Z',
  },
  {
    id: 'usr_8102',
    parichayId: 'PARICHAY_8102_SSD',
    name: 'Amit Verma',
    email: 'amit.verma@mospi.gov.in',
    mobile: '9876543217',
    designation: 'Assistant Director (SSD)',
    division: 'Social Statistics Division (SSD)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 5,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-07-04T09:00:00.000Z',
    updatedAt: '2026-08-15T11:00:00.000Z',
  },
  {
    id: 'usr_9234',
    parichayId: 'PARICHAY_9234_PSD',
    name: 'Meera Joshi',
    email: 'meera.joshi@mospi.gov.in',
    mobile: '9876543218',
    designation: 'Joint Director (Price Statistics)',
    division: 'Price Statistics Division (PSD)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 14,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-06-18T09:00:00.000Z',
    updatedAt: '2026-08-10T11:00:00.000Z',
  },
  {
    id: 'usr_9410',
    parichayId: 'PARICHAY_9410_CPD',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@mospi.gov.in',
    mobile: '9876543219',
    designation: 'Director (Publications)',
    division: 'Coordination & Publication Division (CPD)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 15,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-05-11T09:00:00.000Z',
    updatedAt: '2026-08-01T11:00:00.000Z',
  },
  {
    id: 'usr_9522',
    parichayId: 'PARICHAY_9522_SDRD',
    name: 'Priya Sengupta',
    email: 'priya.sengupta@mospi.gov.in',
    mobile: '9876543220',
    designation: 'Senior Statistical Officer (SSO)',
    division: 'Survey Design and Research Division (SDRD)',
    cadre: 'Subordinate Statistical Service (SSS)',
    location: 'Kolkata',
    experienceYears: 7,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-04-01T09:00:00.000Z',
    updatedAt: '2026-07-25T11:00:00.000Z',
  },
  {
    id: 'usr_9630',
    parichayId: 'PARICHAY_9630_NSO',
    name: 'Alok Pandey',
    email: 'alok.pandey@mospi.gov.in',
    mobile: '9876543221',
    designation: 'Deputy Director General (NSO)',
    division: 'National Statistical Office (NSO)',
    cadre: 'Indian Statistical Service (ISS)',
    location: 'New Delhi',
    experienceYears: 22,
    proficiency: {},
    assessmentHistory: [],
    enrolledCourses: [],
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2026-07-10T11:00:00.000Z',
  },
];

const INITIAL_SEEDED_USERS: UserRecord[] = SAMPLE_DEMO_USERS;

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

  public seedSampleUsers(): void {
    for (const u of SAMPLE_DEMO_USERS) {
      this.users.set(u.id, { ...u, proficiency: { ...u.proficiency }, assessmentHistory: [...u.assessmentHistory], enrolledCourses: [...u.enrolledCourses] });
    }
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

    // Default initial proficiencies (empty until assessments taken)
    const defaultProf: Record<string, number> = payload.proficiency || {};

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

  public deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  public clearAllUsers(): void {
    this.users.clear();
  }
}

export const userDb = UserDatabase.getInstance();
