"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <>
      <button
        className="bg-black text-white px-4 rounded-full"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </>
  );
}
