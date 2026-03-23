"use client";

import type { UserProgress } from "@/types/progress";
import Link from "next/link";

interface HeaderProps {
  progress?: UserProgress;
}

export default function Header({ progress }: HeaderProps) {
  return (
    <header className="border-b border-[#30363d] bg-[#161b22]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <span className="text-[#3fb950] font-mono font-bold text-lg">
            :learn
          </span>
          <span className="text-[#e6edf3] font-bold">VIM</span>
        </Link>

        {progress && (
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <span>
              <span className="text-[#3fb950] font-bold">
                {progress.totalCompleted}
              </span>{" "}
              solved
            </span>
            {progress.currentStreak > 0 && (
              <span>
                <span className="text-[#d29922] font-bold">
                  {progress.currentStreak}
                </span>{" "}
                day streak
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
