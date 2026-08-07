"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="soft-panel w-full max-w-md space-y-5 p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData)
          .then(() => {
            router.push("/dashboard");
            router.refresh();
          })
          .catch((err: unknown) => {
            const message =
              err instanceof Error ? err.message : "Authentication failed";
            setError(message);
          })
          .finally(() => setLoading(false));
      }}
    >
      <div className="space-y-2 text-center">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
          {flow === "signIn" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-ink-muted">
          {flow === "signIn"
            ? "Sign in to open your documents."
            : "Start writing with Inkwell."}
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-ink-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-rule bg-paper px-4 py-3 outline-none transition focus:border-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-ink-muted">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={
            flow === "signIn" ? "current-password" : "new-password"
          }
          className="w-full rounded-xl border border-rule bg-paper px-4 py-3 outline-none transition focus:border-accent"
        />
      </label>

      <input name="flow" type="hidden" value={flow} />

      {error ? (
        <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-accent px-4 py-3 text-paper-elevated shadow-[var(--shadow-soft)] transition hover:opacity-95 disabled:opacity-60"
      >
        {loading
          ? "Please wait…"
          : flow === "signIn"
            ? "Sign in"
            : "Sign up"}
      </button>

      <button
        type="button"
        className="w-full text-sm text-ink-muted underline-offset-4 hover:underline"
        onClick={() => {
          setError(null);
          setFlow(flow === "signIn" ? "signUp" : "signIn");
        }}
      >
        {flow === "signIn"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
