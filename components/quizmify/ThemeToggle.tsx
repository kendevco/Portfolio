"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaArrowUp } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";

export function ThemeToggle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={className} {...props}>
        <button
          title="Toggle theme"
          className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          onClick={toggleTheme}
        >
          {theme === "light" ? <BsSun /> : <BsMoon />}
        </button>
    </div>
  );
}
