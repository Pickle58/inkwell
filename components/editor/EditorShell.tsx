"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AiChatSidebar } from "./AiChatSidebar";
import { DocumentTitle } from "./DocumentTitle";
import { KnowledgeSidebar } from "./KnowledgeSidebar";
import { RichTextEditor } from "./RichTextEditor";
import { SaveStatus } from "./SaveStatus";

export function EditorShell({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const document = useQuery(api.documents.get, { documentId });
  const [saving, setSaving] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [mobilePane, setMobilePane] = useState<"knowledge" | "doc" | "chat">(
    "doc",
  );

  if (document === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center text-ink-muted">
        Loading document…
      </main>
    );
  }

  if (document === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <p className="text-ink-muted">Document not found.</p>
        <Link href="/dashboard" className="text-accent underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-rule bg-paper-elevated/80 px-4 py-3 backdrop-blur md:px-6">
        <Link
          href="/dashboard"
          className="shrink-0 rounded-xl border border-rule px-3 py-1.5 text-sm text-ink-muted transition hover:text-ink"
        >
          ← Dashboard
        </Link>
        <DocumentTitle
          documentId={documentId}
          title={document.title}
          onSavingChange={setSaving}
        />
        <SaveStatus
          status={saving ? "saving" : "saved"}
          updatedAt={document.updatedAt}
        />
      </header>

      <div className="flex gap-2 border-b border-rule px-4 py-2 md:hidden">
        {(
          [
            ["knowledge", "Knowledge"],
            ["doc", "Document"],
            ["chat", "AI"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMobilePane(key)}
            className={`rounded-xl px-3 py-1.5 text-sm ${
              mobilePane === key
                ? "bg-accent text-paper-elevated"
                : "border border-rule text-ink-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 md:grid-cols-[260px_minmax(0,1fr)_300px] lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div
          className={`min-h-0 ${mobilePane === "knowledge" ? "block" : "hidden"} md:block`}
        >
          <KnowledgeSidebar documentId={documentId} />
        </div>
        <div
          className={`min-h-0 ${mobilePane === "doc" ? "flex" : "hidden"} md:flex`}
        >
          <RichTextEditor
            documentId={documentId}
            content={document.content}
            onSavingChange={setSaving}
            onSelectionChange={setSelectedText}
          />
        </div>
        <div
          className={`min-h-0 ${mobilePane === "chat" ? "block" : "hidden"} md:block`}
        >
          <AiChatSidebar
            documentId={documentId}
            selectedText={selectedText}
          />
        </div>
      </div>
    </main>
  );
}
