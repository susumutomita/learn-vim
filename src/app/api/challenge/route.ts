import { getRandomBuiltinChallenge } from "@/lib/builtin-challenges";
import { askClaudeJSON } from "@/lib/claude";
import { buildChallengePrompt } from "@/lib/prompts";
import type { Category, Challenge, Difficulty } from "@/types/challenge";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      difficulty,
      completedCount = 0,
      useBuiltin = true,
      excludeIds = [],
    } = body as {
      category: Category;
      difficulty: Difficulty;
      completedCount?: number;
      useBuiltin?: boolean;
      excludeIds?: string[];
    };

    // デフォルトで組み込みチャレンジを使用（即座にレスポンス）
    if (useBuiltin) {
      const challenge = getRandomBuiltinChallenge(
        category,
        difficulty,
        excludeIds,
      );
      if (challenge) {
        return NextResponse.json({ challenge, source: "builtin" });
      }
    }

    // AI生成を試行
    try {
      const prompt = buildChallengePrompt(category, difficulty, completedCount);

      let challenge: Challenge | null = null;
      let retries = 0;

      while (!challenge && retries < 2) {
        try {
          const result = await askClaudeJSON<Challenge>(prompt);

          if (
            result.initialContent &&
            result.title &&
            result.description &&
            result.hints?.length > 0
          ) {
            if (
              result.type === "editor" &&
              result.initialContent === result.expectedContent
            ) {
              retries++;
              continue;
            }
            challenge = {
              ...result,
              id: result.id || `${category}-${difficulty}-${Date.now()}`,
              category,
              difficulty,
            };
          } else {
            retries++;
          }
        } catch {
          retries++;
        }
      }

      if (challenge) {
        return NextResponse.json({ challenge, source: "ai" });
      }
    } catch {
      // AI生成失敗 → フォールバック
    }

    // 最終フォールバック: 難易度を無視して組み込みから取得
    const fallback = getRandomBuiltinChallenge(category, undefined, excludeIds);
    if (fallback) {
      return NextResponse.json({ challenge: fallback, source: "builtin" });
    }

    return NextResponse.json(
      { error: "No challenges available for this category" },
      { status: 404 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
