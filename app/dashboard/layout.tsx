import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import GuestBanner from "@/components/layout/GuestBanner";
import DashboardMain from "@/components/layout/DashboardMain";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isGuest = !session?.user;

  const user = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar user={user} />
        {isGuest && <GuestBanner />}
        <DashboardMain>{children}</DashboardMain>
      </div>
    </div>
  );
}
