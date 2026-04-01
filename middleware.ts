// Auth is optional — no routes are protected.
// Empty middleware satisfies Next.js without blocking any routes.
export function middleware() {}

export const config = {
  matcher: [], // No routes intercepted
};
