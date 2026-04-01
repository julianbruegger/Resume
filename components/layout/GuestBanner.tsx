import Link from "next/link";

export default function GuestBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between gap-4 text-sm">
      <p className="text-amber-800">
        <span className="font-medium">Guest mode —</span> your data is saved in this browser only.
      </p>
      <Link
        href="/login"
        className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
      >
        Sign in to sync
      </Link>
    </div>
  );
}
