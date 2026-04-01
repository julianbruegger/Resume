"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        {isGuest ? (
          <>
            <span className="text-sm text-gray-500">Guest</span>
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors duration-150"
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
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold select-none">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {user.name ?? user.email ?? "User"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors duration-150"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
