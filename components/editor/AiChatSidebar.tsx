"use client";

import {
  useAction,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function AiChatSidebar({
  documentId,
  selectedText,
}: {
  documentId: Id<"documents">;
  selectedText: string;
}) {
  const { isAuthenticated } = useConvexAuth();
  const messages = useQuery(
    api.chat.listByDocument,
    isAuthenticated ? { documentId } : "skip",
  );
  const assist = useAction(api.ai.assist);
  const clear = useMutation(api.chat.clear);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, sending]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || sending) return;
    setError(null);
    setSending(true);
    setInput("");
    void assist({
      documentId,
      message,
      selectedText: selectedText || undefined,
    })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "AI request failed");
      })
      .finally(() => setSending(false));
  }

  return (
    <aside className="soft-panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-rule px-4 py-3">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-lg">
            AI chat
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Writes and edits using your knowledge.
          </p>
        </div>
        <button
          type="button"
          className="text-xs text-ink-muted hover:text-accent"
          onClick={() => {
            void clear({ documentId });
          }}
        >
          Clear
        </button>
      </div>

      {selectedText ? (
        <div className="border-b border-rule bg-accent-soft/60 px-4 py-2 text-xs text-accent">
          Using selection: “
          {selectedText.length > 80
            ? `${selectedText.slice(0, 80)}…`
            : selectedText}
          ”
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages === undefined ? (
          <p className="text-sm text-ink-muted">Loading chat…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Ask Inkwell to draft, revise, or answer using your knowledge.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`rounded-xl px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-6 bg-accent text-paper-elevated"
                  : "mr-6 border border-rule bg-paper"
              }`}
            >
              <p className="mb-1 text-[11px] uppercase tracking-wide opacity-70">
                {message.role === "user" ? "You" : "Inkwell"}
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
        {sending ? (
          <p className="text-sm text-ink-muted">Thinking…</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="space-y-2 border-t border-rule p-4">
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to write or edit…"
          rows={3}
          className="w-full resize-none rounded-xl border border-rule bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="w-full rounded-xl bg-accent px-3 py-2 text-sm text-paper-elevated disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </aside>
  );
}
