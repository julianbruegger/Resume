import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Lightweight auth config for middleware — no Prisma import
export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isDashboard && !isLoggedIn) {
        return false; // redirect to signIn
      }
      if (nextUrl.pathname === "/login" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
};
