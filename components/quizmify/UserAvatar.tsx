"use client";
import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const UserAvatar = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await currentProfile();
      setProfile(fetchedProfile);
    };

    fetchProfile();
  }, []);

  return (
    <Avatar {...profile}>
      {profile?.imageUrl ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={profile?.imageUrl}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{profile?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;