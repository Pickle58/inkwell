"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-sm text-ink-muted underline-offset-4 hover:underline"
      onClick={() => {
        void signOut().then(() => {
          router.push("/");
          router.refresh();
        });
      }}
    >
      Sign out
    </button>
  );
}
