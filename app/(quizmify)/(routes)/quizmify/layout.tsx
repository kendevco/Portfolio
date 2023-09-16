import { cn } from "@/lib/utils";
import "../../../globals.css"

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "@/components/quizmify/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizmify",
  description: "Quiz yourself on anything!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-16")}>
          <Navbar />
          {children}
          <Toaster />
      </body>
    </html>
  );
}
