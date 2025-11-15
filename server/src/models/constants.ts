export const EXPLORATION_TYPES = {
    ROADMAP: 'roadmap',
    SUBJECTS: 'subjects',
} as const;

export type ExplorationType = typeof EXPLORATION_TYPES[keyof typeof EXPLORATION_TYPES];
