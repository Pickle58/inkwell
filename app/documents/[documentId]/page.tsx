"use client";

import { use } from "react";
import { EditorShell } from "@/components/editor/EditorShell";
import type { Id } from "@/convex/_generated/dataModel";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = use(params);
  return <EditorShell documentId={documentId as Id<"documents">} />;
}
