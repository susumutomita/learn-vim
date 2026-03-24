"use client";

import { useCallback, useEffect, useState } from "react";

const TUTORIAL_KEY = "learn-vim-tutorial-seen";

const steps = [
  {
    title: ":learn VIM へようこそ！",
    description:
      "Vim/Neovim、Ghostty、Claude Code のコマンドをインタラクティブに学べるアプリです。",
    icon: "🎯",
  },
  {
    title: "問題を解く",
    description:
      "カテゴリを選ぶと問題が出題されます。\n\n• エディタ問題 → Vimエディタ上で実際に操作\n• コマンド問題 → 答えをテキストで入力して Enter",
    icon: "⌨️",
  },
  {
    title: ":w で提出",
    description:
      "エディタ問題では Vim と同じように `:w` や `:wq` で回答を提出できます。\nコマンド問題では入力欄に答えを打って Enter を押してください。",
    icon: "💾",
  },
  {
    title: "AI チューターに質問",
    description:
      "右側のチャットパネルで AI に何でも質問できます。\n\n• わからないコマンドの解説\n• 応用テクニックの深堀り\n• 苦手分野のアドバイス",
    icon: "🤖",
  },
  {
    title: "さあ、始めましょう！",
    description:
      "カテゴリを選んで最初の問題に挑戦してみてください。\nHint ボタンで段階的にヒントも見られます。",
    icon: "🚀",
  },
];

export default function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(TUTORIAL_KEY);
    if (!seen) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem(TUTORIAL_KEY, "true");
      setIsVisible(false);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full mx-4 shadow-2xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-6">
          {steps.map((_, i) => (
            <div
              key={`step-${i}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep
                  ? "bg-[#3fb950]"
                  : i < currentStep
                    ? "bg-[#238636]"
                    : "bg-[#30363d]"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-4">
          <div className="text-5xl">{step.icon}</div>
          <h2 className="text-xl font-bold text-[#e6edf3]">{step.title}</h2>
          <p className="text-sm text-[#8b949e] leading-relaxed whitespace-pre-line">
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-8 pb-6">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors"
          >
            スキップ
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-lg transition-colors"
          >
            {currentStep < steps.length - 1 ? "次へ →" : "始める！"}
          </button>
        </div>
      </div>
    </div>
  );
}
