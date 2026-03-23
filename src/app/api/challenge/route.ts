import { NextRequest, NextResponse } from "next/server";
import { askClaudeJSON } from "@/lib/claude";
import { buildChallengePrompt } from "@/lib/prompts";
import type { Category, Difficulty, Challenge } from "@/types/challenge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      difficulty,
      completedCount = 0,
    } = body as {
      category: Category;
      difficulty: Difficulty;
      completedCount?: number;
    };

    const prompt = buildChallengePrompt(category, difficulty, completedCount);

    let challenge: Challenge | null = null;
    let retries = 0;

    while (!challenge && retries < 3) {
      try {
        const result = await askClaudeJSON<Challenge>(prompt);

        // Validate
        if (
          result.initialContent &&
          result.title &&
          result.description &&
          result.hints?.length > 0
        ) {
          // For editor type, ensure initial and expected differ
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

    if (!challenge) {
      return NextResponse.json(
        { error: "Failed to generate challenge after retries" },
        { status: 500 }
      );
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
