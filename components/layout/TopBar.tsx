"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "G";
}

export default function TopBar({ user }: TopBarProps) {
  const isGuest = !user;
  const initials = getInitials(user?.name, user?.email);

  return (
    <header className="h-16 bg-surface border-b border-rim flex items-center justify-end px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {isGuest ? (
          <>
            <span className="text-sm text-ink-soft">Guest</span>
            <Link
              href="/login"
              className="text-sm font-medium text-brand hover:text-brand-h border border-rim hover:border-brand rounded-lg px-3 py-1.5 transition-colors duration-150"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User avatar"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-brand text-brand-fg flex items-center justify-center text-xs font-semibold select-none">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-ink">
                {user.name ?? user.email ?? "User"}
              </span>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm font-medium text-ink-soft hover:text-ink border border-rim hover:border-ink-dim rounded-lg px-3 py-1.5 transition-colors duration-150"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
