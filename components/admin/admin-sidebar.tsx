"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Award, 
  Users, 
  Settings,
  MessageSquare,
  Database,
  ExternalLink
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500"
  },
  {
    label: "Experiences",
    icon: Award,
    href: "/admin/experiences",
    color: "text-violet-500"
  },
  {
    label: "Projects",
    icon: FolderOpen,
    href: "/admin/projects",
    color: "text-pink-700"
  },
  {
    label: "Profiles",
    icon: Users,
    href: "/admin/profiles",
    color: "text-orange-700"
  },
  {
    label: "Discord Integration",
    icon: MessageSquare,
    href: "/admin/discord",
    color: "text-green-700"
  },
  {
    label: "Database",
    icon: Database,
    href: "/admin/database",
    color: "text-blue-700"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-700"
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Portfolio Admin
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-white/10">
        <Link
          href="/"
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
        >
          <ExternalLink className="h-5 w-5 mr-3 text-green-500" />
          View Portfolio
        </Link>
      </div>
    </div>
  );
} 