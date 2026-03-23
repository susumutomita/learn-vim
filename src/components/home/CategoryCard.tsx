"use client";

import type { CategoryMeta } from "@/lib/categories";
import type { CategoryProgress } from "@/types/progress";

interface CategoryCardProps {
  meta: CategoryMeta;
  progress?: CategoryProgress;
  onClick: () => void;
}

export default function CategoryCard({
  meta,
  progress,
  onClick,
}: CategoryCardProps) {
  const completed = progress?.completedCount ?? 0;

  return (
    <button
      onClick={onClick}
      className="group text-left p-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#58a6ff] transition-all hover:bg-[#1c2128]"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg font-mono text-[#58a6ff] group-hover:text-[#79c0ff] font-bold">
          {meta.icon}
        </span>
        <h3 className="font-bold text-[#e6edf3] group-hover:text-white">
          {meta.nameJa}
        </h3>
      </div>
      <p className="text-xs text-[#8b949e] mb-3 line-clamp-2">
        {meta.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#484f58]">{meta.name}</span>
        {completed > 0 && (
          <span className="text-xs text-[#3fb950]">{completed} solved</span>
        )}
      </div>
    </button>
  );
}
