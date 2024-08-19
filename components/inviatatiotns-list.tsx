"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
type Props = {
  invitations: Array<Invitation>;
};

export default function InvitationsList({ invitations }: Props) {
  return (
    <ul
      className="flex flex-col gap-y-2 pr-2
    "
    >
      {invitations?.map((invitation) => (
        <InvitationItem key={invitation.id} {...invitation} />
      ))}
    </ul>
  );
}

type InvitationProps = {
  className?: string;
} & Invitation;

export function InvitationItem({
  id,
  invitedByUser,
  invitedProject,
  className,
}: InvitationProps) {
  return (
    <li
      className={cn(
        className,
        "bg-slate-800 p-4 rounded-md max-md:gap-y-2 flex flex-col md:flex-row md:justify-between md:items-center"
      )}
    >
      <p className="text-xs">
        <span className="font-semibold text-sm">{invitedByUser.name}</span>{" "}
        invited you to join{" "}
        <span className="font-semibold text-sm">{invitedProject.name}</span>
      </p>
      <div className="actions flex flex-row gap-x-2 max-md:ml-auto">
        <Button
          className="!text-xs transition-colors  hover:!bg-green-600 !bg-green-900 text-white"
          size={"sm"}
        >
          Accept
        </Button>
        <Button
          className="!text-xs transition-colors  hover:!bg-red-600"
          size={"sm"}
          variant={"destructive"}
        >
          Decline
        </Button>
      </div>
    </li>
  );
}
