export type LevelId = 1 | 2 | 3 | 4 | 5;

export type GameScreen =
  | 'INTRO_CINEMATIC'
  | 'MAIN_MENU'
  | 'PLAYER_SETUP'
  | 'MAP_DASHBOARD'
  | 'LEVEL_VIEW'
  | 'VICTORY'
  | 'GUIDE'
  | 'LEARNING_HUB'
  | 'TEACHER_DASHBOARD'
  | 'SETTINGS';

export type LevelTab = 'LEARN' | 'MISSION';

export type CharacterMood = 'idle' | 'walking' | 'jump' | 'victory' | 'shocked';

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  score: number; // max 100
  stars: number; // 0 - 3
  quizScore: number;
  interactiveScore: number;
  attempts: number;
}

export interface PlayerProfile {
  name: string;
  grade: string;
  groupNumber?: string;
  startedAt: string;
}

export interface PlayerRecord {
  id: string;
  name: string;
  grade: string;
  groupNumber?: string;
  startedAt: string;
  completedAt?: string;
  totalScore: number;
  totalStars: number;
  levels: Record<LevelId, LevelProgress>;
  predicate: string;
  achievements: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
}
