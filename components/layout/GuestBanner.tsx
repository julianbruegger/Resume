import Link from "next/link";

export default function GuestBanner() {
  return (
    <div className="bg-warn-dim border-b border-warn/20 px-6 py-2 flex items-center justify-between flex-wrap gap-2 text-sm">
      <p className="text-warn-fg">
        <span className="font-medium">Guest mode —</span> your data is saved in this browser only.
      </p>
      <Link
        href="/login"
        className="shrink-0 bg-warn hover:opacity-90 text-warn-fg text-xs font-medium px-3 py-1.5 rounded-md transition-opacity"
      >
        Sign in to sync
      </Link>
    </div>
  );
}
