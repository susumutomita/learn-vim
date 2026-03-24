"use client";

interface FeedbackPanelProps {
  isCorrect: boolean | null;
  feedback: string | null;
  optimalApproach: string | null;
  encouragement: string | null;
  diff: string | null;
  isLoading: boolean;
  expectedAnswer?: string;
  acceptedAnswers?: string[];
}

export default function FeedbackPanel({
  isCorrect,
  feedback,
  optimalApproach,
  encouragement,
  diff,
  isLoading,
  expectedAnswer,
  acceptedAnswers,
}: FeedbackPanelProps) {
  if (isCorrect === null) return null;

  return (
    <div className="p-4 border-t border-[#30363d] space-y-3">
      {/* 正解/不正解の大きな表示 */}
      <div
        className={`flex items-center gap-3 p-3 rounded-lg ${
          isCorrect
            ? "bg-[#0d2818] border border-[#238636]"
            : "bg-[#2d1117] border border-[#da3633]"
        }`}
      >
        <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
        <div>
          <p
            className={`font-bold text-lg ${isCorrect ? "text-[#3fb950]" : "text-[#f85149]"}`}
          >
            {isCorrect ? "正解！" : "不正解"}
          </p>
          {!isCorrect && expectedAnswer && (
            <p className="text-sm text-[#8b949e] mt-1">
              正解:{" "}
              <code className="text-[#bc8cff] bg-[#0d1117] px-2 py-0.5 rounded">
                {expectedAnswer}
              </code>
            </p>
          )}
          {!isCorrect && acceptedAnswers && acceptedAnswers.length > 1 && (
            <p className="text-xs text-[#484f58] mt-0.5">
              他の正解:{" "}
              {acceptedAnswers
                .filter((a) => a !== expectedAnswer)
                .map((a) => (
                  <code
                    key={a}
                    className="text-[#8b949e] bg-[#0d1117] px-1 py-0.5 rounded mr-1"
                  >
                    {a}
                  </code>
                ))}
            </p>
          )}
        </div>
      </div>

      {isCorrect && (
        <p className="text-sm text-[#8b949e]">
          `:w` または <kbd className="text-xs px-1.5 py-0.5 bg-[#1c2128] border border-[#30363d] rounded">Skip &gt;&gt;</kbd> で次の問題へ
        </p>
      )}

      {isLoading && (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-[#1c2128] rounded w-3/4" />
          <div className="h-4 bg-[#1c2128] rounded w-1/2" />
        </div>
      )}

      {feedback && (
        <p className="text-sm text-[#8b949e] leading-relaxed">{feedback}</p>
      )}

      {optimalApproach && (
        <div className="space-y-1">
          <p className="text-xs text-[#484f58]">💡 最適なアプローチ:</p>
          <code className="block text-sm text-[#bc8cff] bg-[#0d1117] px-3 py-2 rounded border border-[#30363d]">
            {optimalApproach}
          </code>
        </div>
      )}

      {diff && !isCorrect && (
        <div className="space-y-1">
          <p className="text-xs text-[#484f58]">差分:</p>
          <pre className="text-xs font-mono bg-[#0d1117] px-3 py-2 rounded border border-[#30363d] overflow-x-auto">
            {diff.split("\n").map((line, i) => (
              <div
                key={i}
                className={
                  line.startsWith("+")
                    ? "text-[#3fb950]"
                    : line.startsWith("-")
                      ? "text-[#f85149]"
                      : "text-[#8b949e]"
                }
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      )}

      {encouragement && (
        <p className="text-xs text-[#58a6ff] italic">{encouragement}</p>
      )}
    </div>
  );
}
