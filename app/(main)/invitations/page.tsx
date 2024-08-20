"use client";
import InvitationsList from "@/components/inviatatiotns-list";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";

type Props = {};

export default function Invitations({}: Props) {
  const [invitations, setInvitations] = useState<Array<Invitation>>([]);

  useEffect(() => {
    console.log(
      "🚀 ~ useEffect ~ process.env.FRONTEND_URL:",
      process.env.FRONTEND_URL
    );
    const fetchInvitations = async () => {
      const res = await fetch(
        `/api/project/invitation-list`,
        {
          cache: "no-cache",
          method: "GET",
        }
      );

      const invitations: Array<Invitation> = await res.json();
      setInvitations(invitations);
    };

    fetchInvitations();
  }, []);

  return (
    <section className="w-full pt-4 h-[calc(100vh-50px)]">
      <h2 className="font-semibold text-2xl">Invitations</h2>
      <Separator className="my-2" />
      <div className="h-full overflow-y-scroll pb-10">
        <InvitationsList invitations={invitations} />
      </div>
    </section>
  );
}
