"use client";

import type { Challenge } from "@/types/challenge";

interface ChallengePanelProps {
  challenge: Challenge | null;
  isLoading: boolean;
}

const difficultyColors = {
  beginner: "text-[#3fb950] border-[#3fb950]",
  intermediate: "text-[#d29922] border-[#d29922]",
  advanced: "text-[#f85149] border-[#f85149]",
};

export default function ChallengePanel({
  challenge,
  isLoading,
}: ChallengePanelProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-[#1c2128] rounded w-3/4" />
        <div className="h-4 bg-[#1c2128] rounded w-1/2" />
        <div className="h-20 bg-[#1c2128] rounded" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-4 text-[#8b949e] text-center">
        <p>カテゴリを選んで問題を生成しましょう</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-xs px-2 py-0.5 border rounded ${difficultyColors[challenge.difficulty]}`}
        >
          {challenge.difficulty.toUpperCase()}
        </span>
        <span className="text-xs px-2 py-0.5 border border-[#30363d] text-[#8b949e] rounded">
          {challenge.category}
        </span>
      </div>

      <h2 className="text-lg font-bold text-[#e6edf3]">{challenge.title}</h2>

      <p className="text-sm text-[#8b949e] leading-relaxed">
        {challenge.description}
      </p>

      {challenge.suggestedCommands && challenge.suggestedCommands.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-[#484f58]">関連コマンド:</p>
          <div className="flex gap-1 flex-wrap">
            {challenge.suggestedCommands.map((cmd) => (
              <kbd
                key={cmd}
                className="text-xs px-1.5 py-0.5 bg-[#1c2128] border border-[#30363d] rounded text-[#bc8cff] font-mono"
              >
                {cmd}
              </kbd>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
