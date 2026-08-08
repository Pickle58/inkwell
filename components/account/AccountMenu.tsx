"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";

function initialsFrom(name: string, email: string) {
  const source = name.trim() || email.trim();
  if (!source) {
    return "?";
  }
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function AccountMenu() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip");
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const name = viewer?.name ?? "";
  const email = viewer?.email ?? "";
  const label = name || email || "Account";
  const initials = initialsFrom(name, email);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-rule bg-paper-elevated px-2.5 py-1.5 text-sm transition hover:border-accent"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className="flex size-8 items-center justify-center rounded-lg bg-accent-soft text-xs font-medium text-accent"
          aria-hidden="true"
        >
          {viewer === undefined ? "…" : initials}
        </span>
        <span className="hidden max-w-36 truncate sm:inline">{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 text-ink-muted transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-rule bg-paper-elevated py-1 shadow-[var(--shadow-lift)]"
        >
          {(name || email) && (
            <div className="border-b border-rule px-3 py-2">
              {name ? (
                <p className="truncate text-sm font-medium">{name}</p>
              ) : null}
              {email ? (
                <p className="truncate text-xs text-ink-muted">{email}</p>
              ) : null}
            </div>
          )}
          <Link
            href="/profile"
            role="menuitem"
            className="block px-3 py-2 text-sm text-ink transition hover:bg-accent-soft"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2 text-left text-sm text-ink transition hover:bg-accent-soft"
            onClick={() => {
              setOpen(false);
              void signOut().then(() => {
                router.push("/");
                router.refresh();
              });
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
