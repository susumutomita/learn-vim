"use client";

import { EditorView } from "@codemirror/view";

export const terminalTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0d1117",
      color: "#e6edf3",
      fontSize: "15px",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#58a6ff",
      padding: "12px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#58a6ff",
      borderLeftWidth: "2px",
    },
    ".cm-activeLine": {
      backgroundColor: "#161b2280",
    },
    ".cm-gutters": {
      backgroundColor: "#0d1117",
      color: "#484f58",
      border: "none",
      paddingRight: "8px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#161b2280",
      color: "#8b949e",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "#264f78 !important",
    },
    ".cm-line": {
      padding: "0 12px",
    },
    "&.cm-focused .cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
    },
    // Vim fat cursor
    ".cm-fat-cursor .cm-cursor": {
      background: "#58a6ff",
      border: "none",
      width: "0.6em",
      opacity: "0.7",
    },
    ".cm-fat-cursor .cm-cursor.cm-cursor-primary": {
      opacity: "0.9",
    },
    // Vim normal mode cursor
    "&:not(.cm-focused) .cm-fat-cursor .cm-cursor": {
      outline: "solid 1px #58a6ff",
      background: "transparent",
    },
  },
  { dark: true }
);
