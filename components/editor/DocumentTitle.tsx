"use client";

import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function DocumentTitle({
  documentId,
  title,
  onSavingChange,
}: {
  documentId: Id<"documents">;
  title: string;
  onSavingChange: (saving: boolean) => void;
}) {
  const updateTitle = useMutation(api.documents.updateTitle);
  const [draft, setDraft] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayValue = draft ?? title;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <input
      value={displayValue}
      aria-label="Document title"
      className="min-w-0 flex-1 truncate bg-transparent font-[family-name:var(--font-fraunces)] text-xl tracking-tight outline-none md:text-2xl"
      onChange={(event) => {
        const next = event.target.value;
        setDraft(next);
        if (timerRef.current) clearTimeout(timerRef.current);
        onSavingChange(true);
        timerRef.current = setTimeout(() => {
          void updateTitle({ documentId, title: next })
            .catch(() => undefined)
            .finally(() => {
              setDraft((current) => (current === next ? null : current));
              onSavingChange(false);
            });
        }, 700);
      }}
    />
  );
}
