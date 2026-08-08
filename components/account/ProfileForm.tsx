"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

export function ProfileForm() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip");
  const updateProfile = useMutation(api.users.updateProfile);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (viewer) {
      setName(viewer.name);
    }
  }, [viewer]);

  if (isLoading || !isAuthenticated) {
    return (
      <p className="text-ink-muted">
        {isLoading ? "Loading profile…" : null}
      </p>
    );
  }

  if (viewer === undefined) {
    return <p className="text-ink-muted">Loading profile…</p>;
  }

  if (viewer === null) {
    return <p className="text-ink-muted">Unable to load your profile.</p>;
  }

  return (
    <form
      className="soft-panel w-full max-w-lg space-y-5 p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSaved(false);
        setSaving(true);
        void updateProfile({ name })
          .then(() => {
            setSaved(true);
          })
          .catch((err: unknown) => {
            const message =
              err instanceof Error ? err.message : "Could not save profile";
            setError(message);
          })
          .finally(() => setSaving(false));
      }}
    >
      <div className="space-y-1">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
          Profile
        </h1>
        <p className="text-ink-muted">Update how you appear in Inkwell.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-ink-muted">Name</span>
        <input
          name="name"
          type="text"
          maxLength={100}
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSaved(false);
          }}
          className="w-full rounded-xl border border-rule bg-paper px-4 py-3 outline-none transition focus:border-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-ink-muted">Email</span>
        <input
          name="email"
          type="email"
          value={viewer.email}
          disabled
          className="w-full rounded-xl border border-rule bg-paper/60 px-4 py-3 text-ink-muted outline-none"
        />
        <span className="block text-xs text-ink-muted">
          Email is tied to your sign-in and can’t be changed here.
        </span>
      </label>

      {error ? (
        <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="text-sm text-ink-muted">Profile saved.</p>
      ) : null}

      <button
        type="submit"
        disabled={saving || name.trim() === viewer.name.trim()}
        className="rounded-xl bg-accent px-5 py-3 text-paper-elevated shadow-[var(--shadow-soft)] transition hover:opacity-95 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
