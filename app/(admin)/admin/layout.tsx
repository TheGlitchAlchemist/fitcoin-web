import type { ReactNode } from "react";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/current-user";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="flex">
        <AdminSidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminNavbar profile={profile} />

          <main className="flex-1 px-4 py-4 sm:px-6 lg:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}