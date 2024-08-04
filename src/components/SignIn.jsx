"use client";
import React from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <div className="border rounded-xl shadow-sm p-8 flex flex-col gap-3 max-w-md w-full">
        <p className="text-3xl font-bold">Sign in</p>
        <button
          className="bg-violet-500 text-white px-4 py-2 font-medium rounded-xl"
          onClick={() => signIn("discord", { callbackUrl: "/" })}
        >
          Sign in with Discord
        </button>
      </div>
    </div>
  );
}
