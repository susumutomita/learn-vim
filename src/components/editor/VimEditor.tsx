"use client";

import { defaultKeymap, history } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { Vim, getCM, vim } from "@replit/codemirror-vim";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { terminalTheme } from "./EditorTheme";
import VimStatusBar from "./VimStatusBar";

type VimModeChangeHandler = (e: { mode: string }) => void;

export interface VimEditorHandle {
  getContent: () => string;
  setContent: (text: string) => void;
  reset: () => void;
  focus: () => void;
}

interface VimEditorProps {
  initialContent: string;
  onSubmit?: () => void;
  onHint?: () => void;
  className?: string;
}

const VimEditor = forwardRef<VimEditorHandle, VimEditorProps>(
  function VimEditor({ initialContent, onSubmit, onHint, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [mode, setMode] = useState("normal");
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    const initialContentRef = useRef(initialContent);

    useImperativeHandle(ref, () => ({
      getContent: () => viewRef.current?.state.doc.toString() ?? "",
      setContent: (text: string) => {
        if (viewRef.current) {
          viewRef.current.dispatch({
            changes: {
              from: 0,
              to: viewRef.current.state.doc.length,
              insert: text,
            },
          });
        }
      },
      reset: () => {
        if (viewRef.current) {
          viewRef.current.dispatch({
            changes: {
              from: 0,
              to: viewRef.current.state.doc.length,
              insert: initialContentRef.current,
            },
          });
        }
      },
      focus: () => viewRef.current?.focus(),
    }));

    const updateCursorPos = useCallback((view: EditorView) => {
      const pos = view.state.selection.main.head;
      const line = view.state.doc.lineAt(pos);
      setCursorPos({
        line: line.number,
        col: pos - line.from + 1,
      });
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;

      // Register custom ex commands - :w and :wq trigger submit
      if (onSubmit) {
        Vim.defineEx("submit", "sub", () => onSubmit());
        Vim.defineEx("write", "w", () => onSubmit());
        Vim.defineEx("wq", "wq", () => onSubmit());
        Vim.defineEx("x", "x", () => onSubmit());
      }
      if (onHint) {
        Vim.defineEx("hint", "hin", () => onHint());
      }
      // :q and :q! do nothing (prevent error)
      Vim.defineEx("quit", "q", () => {});

      const state = EditorState.create({
        doc: initialContent,
        extensions: [
          vim(),
          lineNumbers(),
          history(),
          keymap.of(defaultKeymap),
          terminalTheme,
          EditorView.updateListener.of((update) => {
            if (update.selectionSet || update.docChanged) {
              updateCursorPos(update.view);
            }
          }),
          EditorView.lineWrapping,
        ],
      });

      const view = new EditorView({
        state,
        parent: containerRef.current,
      });

      viewRef.current = view;

      // Listen for vim mode changes via the CodeMirror adapter
      const onModeChange: VimModeChangeHandler = (e) => {
        setMode(e.mode);
      };
      const cm = getCM(view);
      if (cm) {
        cm.on(
          "vim-mode-change",
          onModeChange as unknown as (...args: unknown[]) => void,
        );
      }

      // Focus editor
      view.focus();

      return () => {
        if (cm) {
          cm.off(
            "vim-mode-change",
            onModeChange as unknown as (...args: unknown[]) => void,
          );
        }
        view.destroy();
        viewRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update initial content ref when prop changes
    useEffect(() => {
      initialContentRef.current = initialContent;
      if (viewRef.current) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: initialContent,
          },
        });
      }
    }, [initialContent]);

    return (
      <div
        className={`flex flex-col border border-[#30363d] rounded-lg overflow-hidden ${className ?? ""}`}
      >
        <div className="flex items-center h-8 bg-[#161b22] border-b border-[#30363d] px-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f85149]" />
            <div className="w-3 h-3 rounded-full bg-[#d29922]" />
            <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
          </div>
          <span className="ml-3 text-xs text-[#8b949e]">nvim</span>
        </div>
        <div ref={containerRef} className="flex-1 min-h-0 overflow-auto" />
        <VimStatusBar mode={mode} cursorPos={cursorPos} />
      </div>
    );
  },
);

export default VimEditor;
