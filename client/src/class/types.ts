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

// Các kiểu dữ liệu mới cho Trắc nghiệm Động
export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface NextQuizStep {
  question?: string;
  options?: string[];
  isComplete: boolean;
}

export interface QuizTurn {
  question: string;
  answer: string;
}

export interface QuizRecommendation {
  careerName: string;
  description: string;
  suitability: string;
  suggestedMajors: string[];
}

export interface IUser {
  _id: string;
  fullName: string;
  userId: string;
  avatarUrl: string;
  mssv?: string;
  department?: string; // Khoa
  class?: string; // Lớp
  dateOfBirth?: string; // Ngày sinh
  phoneNumber?: string; // Số điện thoại
  bio?: string; // Mô tả ngắn
}