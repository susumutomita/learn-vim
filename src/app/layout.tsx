import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn VIM - キーボード駆動開発マスター",
  description:
    "Neovim, Ghostty, Claude Codeを使いこなすインタラクティブ学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
