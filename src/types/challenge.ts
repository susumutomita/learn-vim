export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Category =
  | "movement"
  | "editing"
  | "text-objects"
  | "registers"
  | "macros"
  | "search-replace"
  | "visual-mode"
  | "marks"
  | "windows-buffers"
  | "ex-commands"
  | "telescope"
  | "neo-tree"
  | "lsp"
  | "nvim-plugins"
  | "ghostty"
  | "claude-code"
  | "workflow";

export type ChallengeType = "editor" | "command-input" | "sequence";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  type: ChallengeType;
  initialContent: string;
  expectedContent: string;
  hints: string[];
  suggestedCommands?: string[];
  acceptedAnswers?: string[];
}
