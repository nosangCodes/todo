"use client";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
type Props = {};

export default function page({}: Props) {
  const { status } = useSession();
  return (
    <div className="h-svh w-full flex justify-center items-center">
      <button
        disabled={status === "loading"}
        className="border py-2 px-4"
        onClick={() => signIn("google")}
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin transition-all" />
        ) : (
          "Sign in with Google"
        )}
      </button>
    </div>
  );
}
