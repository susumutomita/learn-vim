"use client";

import CategoryCard from "@/components/home/CategoryCard";
import Header from "@/components/layout/Header";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";
import { useProgress } from "@/hooks/useProgress";
import { areas, categories } from "@/lib/categories";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { progress, loaded } = useProgress();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/challenge?category=${categoryId}`);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[#8b949e] font-mono animate-pulse">
          loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TutorialOverlay />
      <Header progress={progress} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#e6edf3] mb-2">
            <span className="text-[#3fb950]">$</span> キーボード駆動開発を
            <span className="text-[#58a6ff]">マスター</span>せよ
          </h1>
          <p className="text-[#8b949e] text-sm max-w-lg mx-auto">
            Neovim + プラグイン + Ghostty + Claude Code
            の実践テクニックをインタラクティブに学ぶ
          </p>
        </div>

        {/* Category Grid by Area */}
        {areas.map((area) => {
          const areaCats = categories.filter((c) => c.area === area.id);
          if (areaCats.length === 0) return null;

          return (
            <section key={area.id} className="mb-8">
              <h2 className="text-sm font-bold text-[#8b949e] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#58a6ff]" />
                {area.nameJa}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {areaCats.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    meta={cat}
                    progress={progress.categories[cat.id]}
                    onClick={() => handleCategoryClick(cat.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
