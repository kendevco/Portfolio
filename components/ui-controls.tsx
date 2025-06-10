"use client";

import { useState } from "react";
import BottomMenu from "./bottom-menu";
import { DiscordantChat } from "./ui/discordant-chat";

export default function UIControls() {
  return (
    <>
      <BottomMenu />
      <DiscordantChat />
    </>
  );
} 