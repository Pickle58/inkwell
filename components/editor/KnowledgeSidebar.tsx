"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState, type FormEvent } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function KnowledgeSidebar({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const items = useQuery(
    api.knowledge.listByDocument,
    isAuthenticated ? { documentId } : "skip",
  );
  const add = useMutation(api.knowledge.add);
  const remove = useMutation(api.knowledge.remove);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <aside className="soft-panel flex h-full min-h-0 flex-col overflow-hidden p-4 text-sm text-ink-muted">
        Loading…
      </aside>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    void add({ documentId, title, body })
      .then(() => {
        setTitle("");
        setBody("");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not add knowledge");
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <aside className="soft-panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-rule px-4 py-3">
        <h2 className="font-[family-name:var(--font-fraunces)] text-lg">
          Knowledge
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Plain-text context for AI edits.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 border-b border-rule p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full rounded-xl border border-rule bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Paste notes, facts, or source text…"
          required
          rows={4}
          className="w-full resize-none rounded-xl border border-rule bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent px-3 py-2 text-sm text-paper-elevated disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add knowledge"}
        </button>
      </form>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {items === undefined ? (
          <p className="text-sm text-ink-muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No knowledge yet. Add references the AI should use.
          </p>
        ) : (
          items.map((item) => (
            <article
              key={item._id}
              className="rounded-xl border border-rule bg-paper px-3 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-[family-name:var(--font-fraunces)] text-sm">
                  {item.title}
                </h3>
                <button
                  type="button"
                  className="text-xs text-ink-muted hover:text-accent"
                  onClick={() => {
                    void remove({ knowledgeId: item._id });
                  }}
                >
                  Remove
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink-muted">
                {item.body}
              </p>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
