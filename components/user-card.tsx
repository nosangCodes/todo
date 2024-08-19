"use client";
import { cn } from "@/lib/utils";
import { LogInIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import ActionTooltip from "./action-tooltop";

type Props = {
  className?: string;
};

export default function UserCard({ className }: Props) {
  const { data } = useSession();
  if (!data?.user) return null;
  return (
    <div className={cn(className, "flex flex-row gap-x-1 items-center")}>
      <Image
        alt="User Image"
        src={data?.user?.image ?? ""}
        className="rounded-full h-7 w-7"
        height={100}
        width={100}
      />
      <p className="text-sm font-semibold">{data?.user?.name}</p>
      <button onClick={() => signOut()} className="ml-auto">
        <ActionTooltip label="Logout">
          <LogInIcon className="h-4 w-4" />
        </ActionTooltip>
      </button>
    </div>
  );
}
