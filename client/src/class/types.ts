import type { ElementType } from 'react';

export type View = 'home' | 'roadmap' | 'careerPath' | 'quiz' | 'university';

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
  role: 'student' | 'high_school_student';
  mssv?: string;
  department?: string; // Khoa
  class?: string; // Lớp
  dateOfBirth?: string; // Ngày sinh
  phoneNumber?: string; // Số điện thoại
  bio?: string; // Mô tả ngắn
}

// Types for CV Generator
export interface CVEducation {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface CVExperience {
    id: string;
    company: string;
    jobTitle: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface CVSkill {
    id: string;
    skillName: string;
    level?: string;
}

export interface CVProject {
    id: string;
    projectName: string;
    description?: string;
    link?: string;
}

export interface CVTemplateStructure {
    layout: 'classic' | 'modern';
    sectionOrder: string[];
}

export interface CVTemplate {
  _id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  structure: CVTemplateStructure;
  createdBy: string | { _id: string; fullName: string };
  isPublic: boolean;
  usageCount: number;
  averageRating: number;
}


export interface CVData {
    _id?: string;
    userId?: string;
    template: CVTemplate; // Luôn là object đầy đủ ở client
    personalDetails: {
        fullName: string;
        jobTitle: string;
        email: string;
        phoneNumber: string;
        address: string;
        avatarUrl: string;
    };
    summary: string;
    education: CVEducation[];
    experience: CVExperience[];
    skills: CVSkill[];
    projects: CVProject[];
}

// --- Thêm các interface để export ---

export interface IExploration {
    _id: string;
    userId: string;
    type: 'roadmap' | 'subjects';
    input: Record<string, any>;
    results: any[];
    createdAt: string;
}

export interface IQuizResult {
    _id: string;
    userId: string;
    history: QuizTurn[];
    recommendations: QuizRecommendation[];
    createdAt: string;
}

export interface School {
    name: string;
    address: string;
    strengths: string[];
    weaknesses: string[];
    uri: string;
}

// --- Các interface cho Chat ---
export interface IMessagePart {
    text?: string;
    fileData?: {
        mimeType?: string;
        fileUri?: string;
        localPreviewUrl?: string; // Dành cho xem trước phía client trước khi tải lên
    };
}

export interface ChatMessage {
  parts: IMessagePart[];
  role: 'user' | 'model';
  timestamp: Date;
}

export interface IChatTurn {
    user: { parts: IMessagePart[] };
    model: { parts: IMessagePart[] };
    createdAt?: string; // Sẽ là string khi nhận từ API
}