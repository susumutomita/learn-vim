"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserProgress } from "@/types/progress";
import { defaultProgress } from "@/types/progress";
import type { Category, Difficulty } from "@/types/challenge";

const STORAGE_KEY = "learn-vim-progress";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, loaded]);

  const markCompleted = useCallback(
    (category: Category, difficulty: Difficulty) => {
      setProgress((prev) => {
        const cat = prev.categories[category] || {
          completedCount: 0,
          totalAttempted: 0,
          currentDifficulty: "beginner" as Difficulty,
        };
        const today = new Date().toISOString().split("T")[0];
        const streak =
          prev.lastSessionDate === today
            ? prev.currentStreak
            : prev.currentStreak + 1;

        return {
          ...prev,
          categories: {
            ...prev.categories,
            [category]: {
              ...cat,
              completedCount: cat.completedCount + 1,
              totalAttempted: cat.totalAttempted + 1,
              currentDifficulty: difficulty,
            },
          },
          totalCompleted: prev.totalCompleted + 1,
          currentStreak: streak,
          lastSessionDate: today,
        };
      });
    },
    []
  );

  const markAttempted = useCallback((category: Category) => {
    setProgress((prev) => {
      const cat = prev.categories[category] || {
        completedCount: 0,
        totalAttempted: 0,
        currentDifficulty: "beginner" as Difficulty,
      };
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [category]: {
            ...cat,
            totalAttempted: cat.totalAttempted + 1,
          },
        },
      };
    });
  }, []);

  const getCompletedCount = useCallback(
    (category: Category): number => {
      return progress.categories[category]?.completedCount ?? 0;
    },
    [progress]
  );

  const getCurrentDifficulty = useCallback(
    (category: Category): Difficulty => {
      const count = progress.categories[category]?.completedCount ?? 0;
      if (count >= 10) return "advanced";
      if (count >= 5) return "intermediate";
      return "beginner";
    },
    [progress]
  );

  return {
    progress,
    loaded,
    markCompleted,
    markAttempted,
    getCompletedCount,
    getCurrentDifficulty,
  };
}
