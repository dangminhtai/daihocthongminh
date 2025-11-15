
import type { ElementType } from 'react';

export type View = 'home' | 'roadmap' | 'careerPath' | 'quiz';

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
}

export interface Subject {
  id: string;
  name: string;
}

export interface MajorSuggestion {
  majorName: string;
  description: string;
  coreSkills: string[];
}

export interface CareerSuggestion {
  careerName: string;
  description: string;
  suitability: string;
}

export interface MajorDetails {
  trainingObjectives: string;
  mainSubjects: string[];
  electiveSubjects: string[];
  curriculumRoadmap: string[];
  careerOrientations: string[];
}

// Các kiểu dữ liệu mới cho Trắc nghiệm
export interface QuizOption {
  text: string;
  nextQuestion: string | null;
  payload: string;
  requiresInput?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface QuizRecommendation {
  careerName: string;
  description: string;
  suitability: string;
  suggestedMajors: string[];
}
