"use client";

import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { formatSavedAt } from "@/lib/format";
import { CreateDocumentButton } from "./CreateDocumentButton";

export function DocumentList() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const documents = useQuery(
    api.documents.list,
    isAuthenticated ? {} : "skip",
  );

  if (isLoading) {
    return (
      <div className="soft-panel p-8 text-ink-muted">Loading documents…</div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (documents === undefined) {
    return (
      <div className="soft-panel p-8 text-ink-muted">Loading documents…</div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="soft-panel flex flex-col items-start gap-4 p-10">
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl">
          No documents yet
        </h2>
        <p className="max-w-md text-ink-muted">
          Create your first document to start writing with knowledge and AI.
        </p>
        <CreateDocumentButton className="rounded-xl bg-accent px-5 py-3 text-paper-elevated shadow-[var(--shadow-soft)]" />
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((document) => (
        <li key={document._id}>
          <Link
            href={`/documents/${document._id}`}
            className="soft-panel block h-full p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <h2 className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight">
              {document.title || "Untitled"}
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Saved {formatSavedAt(document.updatedAt)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
