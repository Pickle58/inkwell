"use client";

import { formatSavedAt } from "@/lib/format";

export function SaveStatus({
  status,
  updatedAt,
}: {
  status: "idle" | "saving" | "saved" | "error";
  updatedAt: number;
}) {
  if (status === "saving") {
    return <span className="text-sm text-ink-muted">Saving…</span>;
  }
  if (status === "error") {
    return <span className="text-sm text-accent">Save failed</span>;
  }
  return (
    <span className="text-sm text-ink-muted">
      Saved {formatSavedAt(updatedAt)}
    </span>
  );
}
