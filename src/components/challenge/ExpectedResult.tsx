"use client";

import { useState } from "react";

interface ExpectedResultProps {
  content: string;
}

export default function ExpectedResult({ content }: ExpectedResultProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div className="border-t border-[#30363d]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-xs text-[#8b949e] hover:text-[#e6edf3] text-left flex items-center gap-1 transition-colors"
      >
        <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
          &gt;
        </span>
        期待される結果を表示
      </button>
      {isOpen && (
        <pre className="px-4 pb-3 text-xs text-[#8b949e] font-mono whitespace-pre-wrap overflow-x-auto bg-[#0d1117] mx-4 mb-3 p-3 rounded border border-[#30363d]">
          {content}
        </pre>
      )}
    </div>
  );
}
