import type { Category, Difficulty, ChallengeType } from "@/types/challenge";
import { categories } from "./categories";

export function buildChallengePrompt(
  category: Category,
  difficulty: Difficulty,
  completedCount: number
): string {
  const meta = categories.find((c) => c.id === category);
  if (!meta) throw new Error(`Unknown category: ${category}`);

  const difficultyGuide = {
    beginner: "基本的な単一コマンドの使い方。3-5行の短いテキスト。",
    intermediate: "複数コマンドの組み合わせ。5-10行のテキスト。実践的なコード例を使う。",
    advanced: "複雑な操作の連鎖、効率的なテクニック。10-20行のリアルなコード。最少キーストロークを意識。",
  };

  if (meta.type === "editor") {
    return `あなたはVim/Neovim学習アプリの問題生成AIです。
カテゴリ「${meta.nameJa}」(${meta.name}) の ${difficulty} レベルの問題を1つ生成してください。

対象コマンド: ${meta.commands.join(", ")}
難易度ガイド: ${difficultyGuide[difficulty]}
これまでの完了数: ${completedCount}問

以下のJSON形式で出力してください:
{
  "id": "ユニークなID (category-difficulty-番号)",
  "title": "問題のタイトル (日本語、簡潔に)",
  "description": "何をすべきかの説明 (日本語、具体的に。使うべきコマンドのヒントは含めない)",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "type": "editor",
  "initialContent": "エディタに表示する初期テキスト",
  "expectedContent": "正しい操作後のテキスト",
  "hints": ["ヒント1 (日本語)", "ヒント2 (より具体的)", "ヒント3 (答えに近い)"],
  "suggestedCommands": ["使うべきコマンド1", "コマンド2"]
}

重要:
- initialContentとexpectedContentは必ず異なること
- 実際のコード例やリアルなテキストを使うこと (変数名、関数名など)
- マニュアルに載っているような基本的すぎる例は避け、実践的な場面を想定すること
- ${completedCount > 0 ? "前の問題と違うパターンの問題を出すこと" : ""}`;
  }

  return buildCommandInputPrompt(meta, difficulty, completedCount);
}

function buildCommandInputPrompt(
  meta: { id: Category; nameJa: string; name: string; commands: string[]; type: ChallengeType },
  difficulty: Difficulty,
  completedCount: number
): string {
  return `あなたはVim/Neovim/開発ツール学習アプリの問題生成AIです。
カテゴリ「${meta.nameJa}」(${meta.name}) の ${difficulty} レベルの問題を1つ生成してください。

対象コマンド/操作: ${meta.commands.join(", ")}
これまでの完了数: ${completedCount}問

この問題は「コマンド入力方式」です。シナリオを提示し、ユーザーが正しいコマンドやキーシーケンスを入力します。

以下のJSON形式で出力してください:
{
  "id": "ユニークなID",
  "title": "問題のタイトル (日本語)",
  "description": "シナリオの説明 (日本語、具体的な状況を描写)",
  "category": "${meta.id}",
  "difficulty": "${difficulty}",
  "type": "${meta.type}",
  "initialContent": "シナリオの詳細や参考情報 (コードの状況説明など)",
  "expectedContent": "",
  "hints": ["ヒント1", "ヒント2", "ヒント3"],
  "acceptedAnswers": ["正解1", "別の正解表記2"],
  "suggestedCommands": ["関連コマンド"]
}

重要:
- acceptedAnswersには同じ操作の異なる表記方法を含めること (例: "<leader>ff" と "Space ff")
- 実践的なシナリオを想定すること (コードレビュー中、バグ修正中、リファクタリング中など)
- ${completedCount > 0 ? "前の問題と違うパターンの問題を出すこと" : ""}`;
}

export function buildFeedbackPrompt(
  description: string,
  category: Category,
  userContent: string,
  expectedContent: string,
  isCorrect: boolean
): string {
  return `あなたはVim/Neovim学習アプリのフィードバックAIです。

問題: ${description}
カテゴリ: ${category}
ユーザーの結果:
\`\`\`
${userContent}
\`\`\`

期待される結果:
\`\`\`
${expectedContent}
\`\`\`

正解: ${isCorrect ? "はい" : "いいえ"}

${isCorrect ? "正解の場合:" : "不正解の場合:"}
以下のJSON形式でフィードバックを生成してください:
{
  "feedback": "フィードバック (日本語、2-3文。${isCorrect ? "よくできた点を褒め、さらに効率的な方法があれば紹介" : "何が違うか説明し、正しいアプローチを教える"})",
  "optimalApproach": "最も効率的なコマンドシーケンス (例: ciw → 新しい単語 → Esc)",
  "encouragement": "一言の励まし (日本語)"
}`;
}
