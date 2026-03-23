"use client";

interface FeedbackPanelProps {
  isCorrect: boolean | null;
  feedback: string | null;
  optimalApproach: string | null;
  encouragement: string | null;
  diff: string | null;
  isLoading: boolean;
}

export default function FeedbackPanel({
  isCorrect,
  feedback,
  optimalApproach,
  encouragement,
  diff,
  isLoading,
}: FeedbackPanelProps) {
  if (isLoading) {
    return (
      <div className="p-4 border-t border-[#30363d] animate-pulse">
        <div className="h-4 bg-[#1c2128] rounded w-3/4 mb-2" />
        <div className="h-4 bg-[#1c2128] rounded w-1/2" />
      </div>
    );
  }

  if (isCorrect === null) return null;

  return (
    <div className="p-4 border-t border-[#30363d] space-y-3">
      <div className="flex items-center gap-2">
        {isCorrect ? (
          <span className="text-[#3fb950] font-bold text-lg">[OK]</span>
        ) : (
          <span className="text-[#f85149] font-bold text-lg">[NG]</span>
        )}
        <span className={isCorrect ? "text-[#3fb950]" : "text-[#f85149]"}>
          {isCorrect ? "正解!" : "不正解"}
        </span>
      </div>

      {feedback && (
        <p className="text-sm text-[#8b949e] leading-relaxed">{feedback}</p>
      )}

      {optimalApproach && (
        <div className="space-y-1">
          <p className="text-xs text-[#484f58]">最適なアプローチ:</p>
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
