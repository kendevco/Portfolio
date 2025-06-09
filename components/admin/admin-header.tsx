"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <Button variant="ghost" size="sm" className="md:hidden">
        <Menu className="h-4 w-4" />
      </Button>
      <div className="flex items-center ml-auto space-x-4">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      </div>
    </div>
  );
} 