"use client";

import ChallengeControls from "@/components/challenge/ChallengeControls";
import ChallengePanel from "@/components/challenge/ChallengePanel";
import ExpectedResult from "@/components/challenge/ExpectedResult";
import FeedbackPanel from "@/components/challenge/FeedbackPanel";
import type { VimEditorHandle } from "@/components/editor/VimEditor";
import Header from "@/components/layout/Header";
import { useChallenge } from "@/hooks/useChallenge";
import { useProgress } from "@/hooks/useProgress";
import type { Category } from "@/types/challenge";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

const VimEditor = dynamic(() => import("@/components/editor/VimEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-[#0d1117] flex items-center justify-center text-[#8b949e] font-mono">
      loading editor...
    </div>
  ),
});

function ChallengeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("category") as Category | null;

  const editorRef = useRef<VimEditorHandle>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const [commandInput, setCommandInput] = useState("");

  const {
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
  } = useChallenge();

  const {
    progress,
    markCompleted,
    markAttempted,
    getCompletedCount,
    getCurrentDifficulty,
  } = useProgress();

  const hasFetchedRef = useRef(false);

  const loadChallenge = useCallback(() => {
    if (!categoryId) return;
    const difficulty = getCurrentDifficulty(categoryId);
    const completedCount = getCompletedCount(categoryId);
    generateChallenge(categoryId, difficulty, completedCount);
  }, [categoryId, getCurrentDifficulty, getCompletedCount, generateChallenge]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    loadChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!challenge) return;

    let content: string;
    if (challenge.type === "editor") {
      content = editorRef.current?.getContent() ?? "";
    } else {
      content = commandInput;
    }

    markAttempted(challenge.category);
    const isCorrect = await submitAnswer(content);
    if (isCorrect) {
      markCompleted(challenge.category, challenge.difficulty);
    }
  }, [challenge, commandInput, submitAnswer, markCompleted, markAttempted]);

  const handleReset = useCallback(() => {
    if (challenge?.type === "editor") {
      editorRef.current?.reset();
    } else {
      setCommandInput("");
    }
  }, [challenge]);

  const handleSkip = useCallback(() => {
    hasFetchedRef.current = false;
    loadChallenge();
    setCommandInput("");
  }, [loadChallenge]);

  const handleHint = useCallback(() => {
    showHint();
  }, [showHint]);

  if (!categoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8b949e]">
        <button
          onClick={() => router.push("/")}
          className="hover:text-white transition-colors"
        >
          &lt; カテゴリを選択してください
        </button>
      </div>
    );
  }

  const isEditorType = challenge?.type === "editor";

  return (
    <div className="min-h-screen flex flex-col">
      <Header progress={progress} />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Editor / Input Area */}
        <div className="flex-1 flex flex-col min-h-0 lg:min-w-0">
          {isEditorType ? (
            <VimEditor
              ref={editorRef}
              initialContent={challenge?.initialContent ?? ""}
              onSubmit={handleSubmit}
              onHint={handleHint}
              className="flex-1 m-4 mb-0"
            />
          ) : (
            <div className="flex-1 flex flex-col m-4 mb-0 border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
              {/* Scenario display */}
              <div className="flex-1 p-6 overflow-auto">
                {challenge && (
                  <div className="space-y-4">
                    <div className="text-[#8b949e] text-sm whitespace-pre-wrap font-mono">
                      {challenge.initialContent}
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-[#1c2128] rounded w-3/4" />
                    <div className="h-4 bg-[#1c2128] rounded w-1/2" />
                    <div className="h-4 bg-[#1c2128] rounded w-2/3" />
                  </div>
                )}
              </div>

              {/* Instruction banner */}
              <div className="mx-4 mb-2 px-3 py-2 bg-[#1c2128] border border-[#30363d] rounded text-xs text-[#8b949e]">
                💡 コマンドを<strong className="text-[#e6edf3]">テキストとして</strong>下の入力欄に入力してください（例: <code className="text-[#bc8cff]">Cmd+D</code>, <code className="text-[#bc8cff]">dd</code>, <code className="text-[#bc8cff]">:w</code>）→ Enter で送信
              </div>

              {/* Command input */}
              <div className="border-t border-[#30363d] p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#3fb950] font-mono font-bold">$</span>
                  <input
                    ref={commandInputRef}
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="答えのコマンドを入力して Enter..."
                    className="flex-1 bg-transparent text-[#e6edf3] font-mono text-sm outline-none placeholder-[#484f58]"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hints display */}
          {currentHints.length > 0 && (
            <div className="mx-4 mt-2 space-y-1">
              {currentHints.map((hint, i) => (
                <div
                  key={i}
                  className="text-xs text-[#d29922] bg-[#1c2128] px-3 py-1.5 rounded border border-[#30363d]"
                >
                  Hint {i + 1}: {hint}
                </div>
              ))}
            </div>
          )}

          <ChallengeControls
            onSubmit={handleSubmit}
            onReset={handleReset}
            onHint={handleHint}
            onSkip={handleSkip}
            isSubmitting={isSubmitting}
            hintIndex={hintIndex}
            maxHints={challenge?.hints.length ?? 0}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-[#30363d] flex flex-col overflow-auto bg-[#161b22]">
          <div className="flex items-center justify-between px-4 pt-4">
            <button
              onClick={() => router.push("/")}
              className="text-xs text-[#8b949e] hover:text-white transition-colors"
            >
              &lt; Back
            </button>
            {feedbackState.isCorrect && (
              <button
                onClick={handleSkip}
                className="text-xs text-[#3fb950] hover:text-[#56d364] font-bold transition-colors"
              >
                Next &gt;&gt;
              </button>
            )}
          </div>

          <ChallengePanel challenge={challenge} isLoading={isLoading} />

          {isEditorType && challenge && (
            <ExpectedResult content={challenge.expectedContent} />
          )}

          <FeedbackPanel
            isCorrect={feedbackState.isCorrect}
            feedback={feedbackState.feedback}
            optimalApproach={feedbackState.optimalApproach}
            encouragement={feedbackState.encouragement}
            diff={feedbackState.diff}
            isLoading={isFeedbackLoading}
            expectedAnswer={challenge?.expectedContent}
            acceptedAnswers={challenge?.acceptedAnswers}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChallengePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#8b949e] font-mono">
          loading...
        </div>
      }
    >
      <ChallengeContent />
    </Suspense>
  );
}
