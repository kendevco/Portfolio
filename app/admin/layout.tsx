import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-72 z-30 flex-col fixed inset-y-0">
        <AdminSidebar />
      </div>
      <main className="md:pl-72">
        <AdminHeader />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 