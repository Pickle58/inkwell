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
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete={
              flow === "signIn" ? "current-password" : "new-password"
            }
            className="w-full rounded-xl border border-rule bg-paper px-4 py-3 pr-12 outline-none transition focus:border-accent"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted transition hover:text-ink"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.1A10.5 10.5 0 0 1 12 5c7 0 10 7 10 7a13.3 13.3 0 0 1-1.7 2.6" />
                <path d="M6.6 6.6C4 8.4 2.5 11 2 12s3 7 10 7a10.3 10.3 0 0 0 4.1-.8" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
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
