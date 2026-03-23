"use client";

interface VimStatusBarProps {
  mode: string;
  keyBuffer?: string;
  cursorPos?: { line: number; col: number };
}

export default function VimStatusBar({
  mode,
  keyBuffer,
  cursorPos,
}: VimStatusBarProps) {
  const modeColors: Record<string, string> = {
    normal: "bg-[#3fb950] text-black",
    insert: "bg-[#58a6ff] text-black",
    visual: "bg-[#bc8cff] text-black",
    replace: "bg-[#f85149] text-black",
  };

  const modeLabels: Record<string, string> = {
    normal: "NORMAL",
    insert: "INSERT",
    visual: "VISUAL",
    replace: "REPLACE",
  };

  const modeKey = mode.toLowerCase().replace(/\s+.*$/, "");
  const colorClass = modeColors[modeKey] || "bg-[#8b949e] text-black";
  const label = modeLabels[modeKey] || mode.toUpperCase();

  return (
    <div className="flex items-center h-7 bg-[#161b22] border-t border-[#30363d] text-xs select-none">
      <span className={`px-3 py-1 font-bold ${colorClass}`}>{label}</span>
      {keyBuffer && (
        <span className="px-2 text-[#d29922] font-mono">{keyBuffer}</span>
      )}
      <div className="flex-1" />
      {cursorPos && (
        <span className="px-3 text-[#8b949e]">
          {cursorPos.line}:{cursorPos.col}
        </span>
      )}
    </div>
  );
}
