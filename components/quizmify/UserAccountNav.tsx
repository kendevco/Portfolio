"use client";

import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { LogOut } from "lucide-react";

const UserAccountNav = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await currentProfile();
      setProfile(fetchedProfile);
    };

    fetchProfile();
  }, []);

  return (
    <div>User Account Nav</div>


  );
};

export default UserAccountNav;