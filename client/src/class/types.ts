// FIX: Import `ElementType` from `react` to resolve the `Cannot find namespace 'React'` error.
import type { ElementType } from 'react';

export type View = 'home' | 'roadmap' | 'careerPath';

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