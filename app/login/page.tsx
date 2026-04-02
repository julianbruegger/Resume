import Link from "next/link";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-brand text-brand-fg rounded-xl p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            VitaFlow
          </h1>
          <p className="text-ink-soft text-sm text-center">
            Your resume, in minutes.
          </p>
        </div>

        <hr className="w-full border-rim" />

        {/* GitHub sign in */}
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
          className="w-full"
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-prominent hover:bg-prominent-h text-prominent-fg font-medium py-3 px-5 rounded-lg transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        </form>

        <div className="flex items-center gap-3 w-full">
          <hr className="flex-1 border-rim" />
          <span className="text-xs text-ink-dim">or</span>
          <hr className="flex-1 border-rim" />
        </div>

        {/* Guest access */}
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 border border-rim hover:bg-raised text-ink font-medium py-3 px-5 rounded-lg transition-colors duration-200 text-sm"
        >
          Continue as guest
        </Link>

        <p className="text-xs text-ink-dim text-center">
          Guest data is saved in your browser only.{" "}
          <span className="text-brand">Sign in</span> to sync across devices.
        </p>
      </div>
    </div>
  );
}
