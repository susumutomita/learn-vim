import { askClaude } from "@/lib/claude";
import { type NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      history = [],
      context,
    } = body as {
      message: string;
      history: ChatMessage[];
      context?: {
        challengeTitle?: string;
        challengeDescription?: string;
        category?: string;
        difficulty?: string;
        userAnswer?: string;
        isCorrect?: boolean | null;
        weakAreas?: string[];
      };
    };

    const systemContext = buildSystemPrompt(context);
    const conversationHistory = history
      .slice(-6) // 直近6メッセージのみ
      .map(
        (m) =>
          `${m.role === "user" ? "ユーザー" : "アシスタント"}: ${m.content}`,
      )
      .join("\n");

    const prompt = `${systemContext}

${conversationHistory ? `これまでの会話:\n${conversationHistory}\n` : ""}
ユーザー: ${message}

アシスタント:`;

    const result = await askClaude(prompt);

    return NextResponse.json({ reply: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildSystemPrompt(context?: {
  challengeTitle?: string;
  challengeDescription?: string;
  category?: string;
  difficulty?: string;
  userAnswer?: string;
  isCorrect?: boolean | null;
  weakAreas?: string[];
}): string {
  let prompt = `あなたはVim/Neovim/Ghostty/Claude Codeの熟練チューターです。
ユーザーがインタラクティブなVim学習アプリで学んでいます。

ルール:
- 日本語で回答してください
- 簡潔に（3-5文程度）回答してください
- 具体的なVimコマンドの例を含めてください
- コマンドはバッククォートで囲んでください（例: \`dd\`）
- 実践的なtipsを教えてください
- 初心者にもわかりやすく説明してください`;

  if (context) {
    if (context.category) {
      prompt += `\n\n現在のカテゴリ: ${context.category}`;
    }
    if (context.difficulty) {
      prompt += `\n難易度: ${context.difficulty}`;
    }
    if (context.challengeTitle) {
      prompt += `\n現在の問題: ${context.challengeTitle}`;
    }
    if (context.challengeDescription) {
      prompt += `\n問題の説明: ${context.challengeDescription}`;
    }
    if (context.isCorrect !== null && context.isCorrect !== undefined) {
      prompt += `\nユーザーの回答: ${context.userAnswer} (${context.isCorrect ? "正解" : "不正解"})`;
    }
    if (context.weakAreas && context.weakAreas.length > 0) {
      prompt += `\n苦手な分野: ${context.weakAreas.join(", ")}`;
    }
  }

  return prompt;
}
