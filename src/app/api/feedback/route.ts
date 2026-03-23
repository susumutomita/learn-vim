import { NextRequest, NextResponse } from "next/server";
import { askClaudeJSON } from "@/lib/claude";
import { buildFeedbackPrompt } from "@/lib/prompts";
import type { Category } from "@/types/challenge";

interface FeedbackResponse {
  feedback: string;
  optimalApproach: string;
  encouragement: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, category, userContent, expectedContent, isCorrect } =
      body as {
        description: string;
        category: Category;
        userContent: string;
        expectedContent: string;
        isCorrect: boolean;
      };

    const prompt = buildFeedbackPrompt(
      description,
      category,
      userContent,
      expectedContent,
      isCorrect
    );

    const result = await askClaudeJSON<FeedbackResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
