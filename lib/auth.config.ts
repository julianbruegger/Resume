import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Lightweight auth config — no Prisma import, safe for middleware edge runtime.
// Auth is optional: unauthenticated users can use the app in guest mode.
export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
};
