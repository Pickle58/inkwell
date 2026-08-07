"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export function CreateDocumentButton({
  className = "",
  label = "New document",
}: {
  className?: string;
  label?: string;
}) {
  const create = useMutation(api.documents.create);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className={className}
      onClick={() => {
        setLoading(true);
        void create()
          .then((documentId) => {
            router.push(`/documents/${documentId}`);
          })
          .catch(() => setLoading(false));
      }}
    >
      {loading ? "Creating…" : label}
    </button>
  );
}
