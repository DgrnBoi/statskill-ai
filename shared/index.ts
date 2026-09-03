// StatSkill AI Shared Interfaces

export interface User {
  id: string;
  name: string;
  designation: string;
  department: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface Competency {
  id: string;
  skillName: string;
  targetLevel: number;
}
