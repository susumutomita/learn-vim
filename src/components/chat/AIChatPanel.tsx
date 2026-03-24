"use client";

import type { Challenge } from "@/types/challenge";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  challenge: Challenge | null;
  userAnswer?: string;
  isCorrect?: boolean | null;
  weakAreas?: string[];
  onRequestNextChallenge?: (topic?: string) => void;
}

const QUICK_PROMPTS = [
  { label: "💡 これ解説して", prompt: "この問題のコマンドを詳しく解説して" },
  {
    label: "🔍 もっと深く",
    prompt: "この分野をもっと深く教えて。応用テクニックは？",
  },
  {
    label: "🎯 練習方法",
    prompt: "この操作を身につけるための実践的な練習方法を教えて",
  },
  {
    label: "⚡ 使い分け",
    prompt: "似たコマンドとの使い分けを教えて",
  },
];

export default function AIChatPanel({
  challenge,
  userAnswer,
  isCorrect,
  weakAreas,
  onRequestNextChallenge,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // チャレンジが変わったらチャットをリセット
  useEffect(() => {
    setMessages([]);
  }, [challenge?.id]);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            history: messages,
            context: challenge
              ? {
                  challengeTitle: challenge.title,
                  challengeDescription: challenge.description,
                  category: challenge.category,
                  difficulty: challenge.difficulty,
                  userAnswer,
                  isCorrect,
                  weakAreas,
                }
              : undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const assistantMsg: ChatMessage = {
            role: "assistant",
            content: data.reply || "すみません、回答を生成できませんでした。",
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "⚠️ AIに接続できませんでした。Claude Codeが起動しているか確認してください。",
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ 通信エラーが発生しました。",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, challenge, userAnswer, isCorrect, weakAreas, isLoading],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-full shadow-lg transition-colors flex items-center gap-2"
      >
        <span>🤖</span> AI に質問
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full border-t border-[#30363d] bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="text-xs font-bold text-[#e6edf3]">
            AI チューター
          </span>
          {challenge && (
            <span className="text-[10px] text-[#484f58] truncate max-w-32">
              {challenge.category}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-[#484f58] hover:text-[#8b949e] text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-[#484f58] text-center py-2">
              Vimについて何でも聞いてください
            </p>
            {/* Quick prompts */}
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  type="button"
                  key={qp.label}
                  onClick={() => sendMessage(qp.prompt)}
                  className="text-[10px] px-2 py-1.5 bg-[#1c2128] hover:bg-[#30363d] border border-[#30363d] rounded text-[#8b949e] hover:text-[#e6edf3] transition-colors text-left"
                >
                  {qp.label}
                </button>
              ))}
            </div>
            {isCorrect === false && (
              <button
                type="button"
                onClick={() =>
                  sendMessage(
                    "この問題の正解を詳しく解説して。なぜこのコマンドが使われるの？",
                  )
                }
                className="w-full text-xs px-3 py-2 bg-[#2d1117] hover:bg-[#3d1f28] border border-[#da3633] rounded text-[#f85149] hover:text-white transition-colors"
              >
                ❓ 不正解だったので解説してほしい
              </button>
            )}
            {isCorrect === true && onRequestNextChallenge && (
              <button
                type="button"
                onClick={() =>
                  sendMessage(
                    "正解したけど、この分野でもっと難しい問題を出して",
                  )
                }
                className="w-full text-xs px-3 py-2 bg-[#0d2818] hover:bg-[#1a4028] border border-[#238636] rounded text-[#3fb950] hover:text-white transition-colors"
              >
                🚀 もっと難しい問題に挑戦したい
              </button>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#238636] text-white"
                  : "bg-[#1c2128] text-[#e6edf3] border border-[#30363d]"
              }`}
            >
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1c2128] border border-[#30363d] px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-[#30363d]">
        <div className="flex gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Vimについて質問..."
            disabled={isLoading}
            className="flex-1 bg-[#1c2128] text-[#e6edf3] text-xs px-3 py-2 rounded border border-[#30363d] outline-none focus:border-[#58a6ff] placeholder-[#484f58] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded transition-colors disabled:opacity-30"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Markdownっぽいコンテンツをレンダリング
 */
function MessageContent({ content }: { content: string }) {
  // バッククォートで囲まれたコマンドをハイライト
  const parts = content.split(/(`[^`]+`)/g);

  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={`part-${i}`}
              className="text-[#bc8cff] bg-[#0d1117] px-1 py-0.5 rounded text-[11px] font-mono"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={`part-${i}`}>{part}</span>;
      })}
    </span>
  );
}
