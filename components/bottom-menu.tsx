"use client";

import { useTheme } from "@/context/theme-context";
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import {
  useClerk, 
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { FaArrowUp, FaUser, FaUserAlt } from "react-icons/fa";
import { MessageCircle, Shield, Menu, X, Settings } from "lucide-react";

export default function BottomMenu() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user is admin through the admin status API
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const response = await fetch('/api/user/admin-status');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        {/* Expandable Menu Container */}
        <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isExpanded ? 'mb-4' : 'mb-0'}`}>
          
          {/* Menu Items - Only show when expanded */}
          <div className={`flex flex-col gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            
            {/* Theme Toggle */}
            <button
              title="Toggle theme"
              className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
              onClick={toggleTheme}
            >
              {theme === "light" ? <BsSun /> : <BsMoon />}
            </button>

            {/* Scroll to Top */}
            <button
              title="Scroll to top"
              className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
              onClick={scrollToTop}
            >
              <FaArrowUp />
            </button>

            {/* Admin Link - Only show if user is admin */}
            <SignedIn>
              {isAdmin && (
                <Link
                  href="/admin"
                  title="Admin Dashboard"
                  className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
                >
                  <Shield className="h-5 w-5" />
                </Link>
              )}
            </SignedIn>

            {/* User Button / Sign In */}
            <div className="flex items-center">
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-[48px] w-[48px] rounded-[24px] shadow-2xl border border-white border-opacity-40",
                    },
                  }}
                />
              </SignedIn>

              <SignedOut>
                <button
                  title="Sign in"
                  onClick={() => openSignIn()} 
                  className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
                >
                  <FaUser />
                </button>
              </SignedOut>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            title={isExpanded ? "Close menu" : "Open menu"}
            className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
            onClick={toggleMenu}
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </>
  );
} 