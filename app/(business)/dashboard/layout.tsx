import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { requireBusiness } from "@/lib/auth/current-user";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { profile } = await requireBusiness();

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <DashboardNavbar profile={profile} />

          <main className="flex-1 px-4 py-4 sm:px-6 lg:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}