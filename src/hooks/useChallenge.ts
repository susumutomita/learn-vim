"use client";

import { validateAnswer, validateCommandInput } from "@/lib/validator";
import type { Category, Challenge, Difficulty } from "@/types/challenge";
import { useCallback, useState } from "react";

interface FeedbackState {
  isCorrect: boolean | null;
  feedback: string | null;
  optimalApproach: string | null;
  encouragement: string | null;
  diff: string | null;
}

const emptyFeedback: FeedbackState = {
  isCorrect: null,
  feedback: null,
  optimalApproach: null,
  encouragement: null,
  diff: null,
};

export function useChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackState, setFeedbackState] =
    useState<FeedbackState>(emptyFeedback);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [currentHints, setCurrentHints] = useState<string[]>([]);

  const generateChallenge = useCallback(
    async (
      category: Category,
      difficulty: Difficulty,
      completedCount: number,
    ) => {
      setIsLoading(true);
      setFeedbackState(emptyFeedback);
      setHintIndex(0);
      setCurrentHints([]);

      try {
        const res = await fetch("/api/challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, difficulty, completedCount }),
        });

        if (!res.ok) throw new Error("Failed to generate challenge");

        const data = await res.json();
        setChallenge(data.challenge);
      } catch (error) {
        console.error("Challenge generation failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const submitAnswer = useCallback(
    async (userContent: string) => {
      if (!challenge) return false;
      setIsSubmitting(true);

      let isCorrect: boolean;
      let diff: string | null = null;

      if (challenge.type === "editor") {
        const result = validateAnswer(userContent, challenge.expectedContent);
        isCorrect = result.isCorrect;
        diff = result.diff ?? null;
      } else {
        const result = validateCommandInput(
          userContent,
          challenge.acceptedAnswers ?? [challenge.expectedContent],
        );
        isCorrect = result.isCorrect;
      }

      setFeedbackState((prev) => ({ ...prev, isCorrect, diff }));

      // Get AI feedback
      setIsFeedbackLoading(true);
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: challenge.description,
            category: challenge.category,
            userContent,
            expectedContent: challenge.expectedContent,
            isCorrect,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setFeedbackState((prev) => ({
            ...prev,
            feedback: data.feedback,
            optimalApproach: data.optimalApproach,
            encouragement: data.encouragement,
          }));
        }
      } catch {
        // Feedback is optional, don't block
      } finally {
        setIsFeedbackLoading(false);
        setIsSubmitting(false);
      }

      return isCorrect;
    },
    [challenge],
  );

  const showHint = useCallback(() => {
    if (!challenge) return null;
    if (hintIndex < challenge.hints.length) {
      const hint = challenge.hints[hintIndex];
      setCurrentHints((prev) => [...prev, hint]);
      setHintIndex((prev) => prev + 1);
      return hint;
    }
    return null;
  }, [challenge, hintIndex]);

  return {
    challenge,
    isLoading,
    isSubmitting,
    feedbackState,
    isFeedbackLoading,
    hintIndex,
    currentHints,
    generateChallenge,
    submitAnswer,
    showHint,
  };
}
