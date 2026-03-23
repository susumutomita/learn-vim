import type { Category, Difficulty } from "./challenge";

export interface CategoryProgress {
  completedCount: number;
  totalAttempted: number;
  currentDifficulty: Difficulty;
}

export interface UserProgress {
  categories: Partial<Record<Category, CategoryProgress>>;
  totalCompleted: number;
  currentStreak: number;
  lastSessionDate: string;
}

export const defaultProgress: UserProgress = {
  categories: {},
  totalCompleted: 0,
  currentStreak: 0,
  lastSessionDate: "",
};
