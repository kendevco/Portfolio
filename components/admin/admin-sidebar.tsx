"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Award, 
  Users, 
  Settings,
  MessageSquare,
  Database,
  ExternalLink,
  Mic,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500"
  },
  {
    label: "Content",
    icon: MessageSquare,
    href: "/admin/content",
    color: "text-emerald-500"
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
    label: "Skills",
    icon: Star,
    href: "/admin/skills",
    color: "text-purple-600"
  },
  {
    label: "Profiles",
    icon: Users,
    href: "/admin/profiles",
    color: "text-orange-700"
  },
  {
    label: "Discord",
    icon: MessageSquare,
    href: "/admin/discord",
    color: "text-green-700"
  },
  {
    label: "Vapi AI",
    icon: Mic,
    href: "/admin/vapi",
    color: "text-red-700"
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

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-[#111827] text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center">
            <h1 className="text-xl font-bold truncate">
              Portfolio Admin
            </h1>
          </Link>
        )}
        
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/10 p-2"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center w-full font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                isCollapsed ? "justify-center p-3" : "justify-start p-3"
              )}
              title={isCollapsed ? route.label : undefined}
            >
              <route.icon className={cn("h-5 w-5 flex-shrink-0", route.color)} />
              {!isCollapsed && (
                <span className="ml-3 text-sm truncate transition-all duration-200">
                  {route.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className={cn(
            "group flex items-center w-full font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-zinc-400",
            isCollapsed ? "justify-center p-3" : "justify-start p-3"
          )}
          title={isCollapsed ? "View Portfolio" : undefined}
        >
          <ExternalLink className="h-5 w-5 text-green-500 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 text-sm truncate transition-all duration-200">
              View Portfolio
            </span>
          )}
        </Link>
      </div>

      {/* Mobile overlay toggle */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
    </div>
  );
} 