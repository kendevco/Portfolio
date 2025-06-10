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
import { MessageCircle, Shield } from "lucide-react";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isAdmin, setIsAdmin] = useState(false);

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

  const buttonClass = "bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950";

  return (
    <>
      {/* Container for all buttons - fixed positioning */}
      <div className="fixed bottom-5 right-5">
        {/* Theme toggle button - rightmost */}
        <button
          title="Toggle theme"
          className={`${buttonClass} absolute`}
          style={{ right: '0px', bottom: '0px' }}
          onClick={toggleTheme}
        >
          {theme === "light" ? <BsSun /> : <BsMoon />}
        </button>

        {/* Scroll to top button */}
        <button
          title="Scroll to top"
          className={`${buttonClass} absolute`}
          style={{ right: '64px', bottom: '0px' }}
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </button>

        <SignedIn>
          {/* Admin button - only show if admin */}
          {isAdmin && (
            <Link
              href="/admin"
              title="Admin Dashboard"
              className={`${buttonClass} absolute`}
              style={{ right: '128px', bottom: '0px' }}
            >
              <Shield className="h-5 w-5" />
            </Link>
          )}
          
          {/* User button - fixed positioning to prevent offset */}
          <div 
            className="absolute w-[48px] h-[48px] flex items-center justify-center"
            style={{ right: isAdmin ? '192px' : '128px', bottom: '0px' }}
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-[48px] w-[48px] rounded-[24px]",
                  userButtonPopoverCard: "right-0",
                  userButtonPopoverActions: "right-0",
                },
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          {/* Sign in button */}
          <button
            title="Sign in"
            onClick={() => openSignIn()} 
            className={`${buttonClass} absolute`}
            style={{ right: '128px', bottom: '0px' }}
          >
            <FaUser />
          </button>
        </SignedOut>
      </div>
    </>
  );
}