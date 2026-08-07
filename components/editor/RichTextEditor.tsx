"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-sm transition ${
        active
          ? "bg-accent-soft text-accent"
          : "text-ink-muted hover:bg-paper hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  documentId,
  content,
  onSavingChange,
  onSelectionChange,
}: {
  documentId: Id<"documents">;
  content: string;
  onSavingChange: (saving: boolean) => void;
  onSelectionChange: (selectedText: string) => void;
}) {
  const updateContent = useMutation(api.documents.updateContent);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applyingRemoteRef = useRef(false);
  const lastLocalHtmlRef = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Begin writing…",
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[60vh]",
      },
    },
    onUpdate: ({ editor: current }) => {
      if (applyingRemoteRef.current) return;
      const html = current.getHTML();
      lastLocalHtmlRef.current = html;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      onSavingChange(true);
      saveTimerRef.current = setTimeout(() => {
        void updateContent({ documentId, content: html })
          .catch(() => undefined)
          .finally(() => onSavingChange(false));
      }, 700);
    },
    onSelectionUpdate: ({ editor: current }) => {
      const { from, to } = current.state.selection;
      if (from === to) {
        onSelectionChange("");
        return;
      }
      onSelectionChange(current.state.doc.textBetween(from, to, " "));
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (content === lastLocalHtmlRef.current) return;
    if (content === editor.getHTML()) return;
    applyingRemoteRef.current = true;
    editor.commands.setContent(content, { emitUpdate: false });
    lastLocalHtmlRef.current = content;
    applyingRemoteRef.current = false;
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (!editor) {
    return (
      <div className="soft-panel p-8 text-ink-muted">Loading editor…</div>
    );
  }

  return (
    <div className="soft-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-rule px-3 py-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </ToolbarButton>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
