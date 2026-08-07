"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

const MAX_KNOWLEDGE_CHARS = 12000;
const MAX_DOCUMENT_CHARS = 40000;

type AssistResponse = {
  assistantMessage: string;
  documentHtml?: string;
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[truncated]`;
}

function parseAssistResponse(raw: string): AssistResponse {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as AssistResponse;
    if (typeof parsed.assistantMessage === "string") {
      return {
        assistantMessage: parsed.assistantMessage,
        documentHtml:
          typeof parsed.documentHtml === "string"
            ? parsed.documentHtml
            : undefined,
      };
    }
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced?.[1]) {
      try {
        const parsed = JSON.parse(fenced[1].trim()) as AssistResponse;
        if (typeof parsed.assistantMessage === "string") {
          return {
            assistantMessage: parsed.assistantMessage,
            documentHtml:
              typeof parsed.documentHtml === "string"
                ? parsed.documentHtml
                : undefined,
          };
        }
      } catch {
        // fall through
      }
    }
  }
  return { assistantMessage: trimmed };
}

export const assist = action({
  args: {
    documentId: v.id("documents"),
    message: v.string(),
    selectedText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const message = args.message.trim();
    if (!message) {
      throw new Error("Message is required");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured. Set it with: npx convex env set OPENAI_API_KEY <key>",
      );
    }

    const context = await ctx.runQuery(internal.aiHelpers.loadAssistContext, {
      documentId: args.documentId,
    });

    const knowledgeBlocks = context.knowledge
      .map(
        (item, index) =>
          `### Knowledge ${index + 1}: ${item.title}\n${item.body}`,
      )
      .join("\n\n");

    const systemPrompt = `You are Inkwell, a careful writing co-pilot inside a document editor.
Use the provided knowledge as ground truth when relevant.
Respond with ONLY valid JSON matching this shape:
{"assistantMessage": string, "documentHtml"?: string}

Rules:
- assistantMessage: a concise explanation of what you did or how you answered.
- documentHtml: include ONLY when you are writing or editing the document. It must be the FULL updated document as HTML suitable for TipTap (use <p>, <h1>-<h3>, <ul>, <ol>, <li>, <strong>, <em>).
- If the user is only asking a question and does not want edits, omit documentHtml.
- If selected text is provided, prefer editing that passage within the full document.
- Preserve the user's voice and existing structure unless asked to change it.
- Do not invent facts that contradict the knowledge.`;

    const userPrompt = [
      `Document title: ${context.document.title}`,
      `Current document HTML:\n${truncate(context.document.content, MAX_DOCUMENT_CHARS)}`,
      knowledgeBlocks
        ? `Knowledge:\n${truncate(knowledgeBlocks, MAX_KNOWLEDGE_CHARS)}`
        : "Knowledge: (none added)",
      args.selectedText
        ? `Selected text:\n${args.selectedText}`
        : "Selected text: (none)",
      `User request:\n${message}`,
    ].join("\n\n");

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...context.recentMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = parseAssistResponse(raw);

    await ctx.runMutation(internal.chat.appendMessages, {
      documentId: args.documentId,
      userId: context.userId,
      userContent: message,
      assistantContent: parsed.assistantMessage,
    });

    let documentUpdated = false;
    if (parsed.documentHtml && parsed.documentHtml.trim()) {
      await ctx.runMutation(internal.documentsInternal.updateContent, {
        documentId: args.documentId,
        userId: context.userId,
        content: parsed.documentHtml,
      });
      documentUpdated = true;
    }

    return {
      assistantMessage: parsed.assistantMessage,
      documentUpdated,
    };
  },
});
