"use client";
import React from "react";


import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  } from "@clerk/nextjs";
 

const SignInControl = () => {
  return (
    <>
    <SignedIn>
    <UserButton
      afterSignOutUrl="/"
      userProfileUrl="/user-profile" 
      appearance={{
        elements: {
          avatarBox: "h-[48px] w-[48px] rounded-[24px]",
        },
      }}
    />
  </SignedIn>
  <SignedOut>
      <SignInButton 
        afterSignInUrl="/"
      />
  </SignedOut>
  </>
  );
};

export default SignInControl;
