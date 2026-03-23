"use client";

interface ChallengeControlsProps {
  onSubmit: () => void;
  onReset: () => void;
  onHint: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
  hintIndex: number;
  maxHints: number;
}

export default function ChallengeControls({
  onSubmit,
  onReset,
  onHint,
  onSkip,
  isSubmitting,
  hintIndex,
  maxHints,
}: ChallengeControlsProps) {
  return (
    <div className="flex gap-2 p-4 border-t border-[#30363d]">
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "..." : "Submit"}
      </button>
      <button
        onClick={onReset}
        className="px-4 py-1.5 bg-[#1c2128] hover:bg-[#30363d] text-[#8b949e] text-sm rounded-md border border-[#30363d] transition-colors"
      >
        Reset
      </button>
      <button
        onClick={onHint}
        disabled={hintIndex >= maxHints}
        className="px-4 py-1.5 bg-[#1c2128] hover:bg-[#30363d] text-[#d29922] text-sm rounded-md border border-[#30363d] transition-colors disabled:opacity-30"
      >
        Hint ({hintIndex}/{maxHints})
      </button>
      <div className="flex-1" />
      <button
        onClick={onSkip}
        className="px-4 py-1.5 text-[#484f58] hover:text-[#8b949e] text-sm transition-colors"
      >
        Skip &gt;&gt;
      </button>
    </div>
  );
}
