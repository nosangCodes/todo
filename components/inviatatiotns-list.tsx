"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { InvitationResponse } from "@prisma/client";
import { useRouter } from "next/navigation";
type Props = {
  invitations: Array<Invitation>;
};

export default function InvitationsList({ invitations }: Props) {
  return (
    <ul
      className="flex flex-col gap-y-2 pr-2
    "
    >
      {invitations?.length < 1 ? (
        <li>No invitations</li>
      ) : (
        invitations?.map((invitation) => (
          <InvitationItem key={invitation.id} {...invitation} />
        ))
      )}
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleInvitation = async (response: InvitationResponse) => {
    setLoading(true);
    const res = await axios.patch("/api/project/invite-respond", {
      projectInvitationId: id,
      response,
      projectId: invitedProject.id,
    });
    router.refresh();
    if (res.status === 200) {
    }
    setLoading(false);
  };

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
          disabled={loading}
          onClick={() => handleInvitation("ACCEPTED")}
          className="!text-xs transition-colors  hover:!bg-green-600 !bg-green-900 text-white"
          size={"sm"}
        >
          Accept
        </Button>
        <Button
          disabled={loading}
          onClick={() => handleInvitation("DECLINED")}
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
