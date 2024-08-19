import InvitationsList from "@/components/inviatatiotns-list";
import { Separator } from "@/components/ui/separator";
import { headers } from "next/headers";
import React, { Suspense } from "react";

type Props = {};

export default async function Invitations({}: Props) {
  const res = await fetch("http://localhost:3000/api/project/invitation-list", {
    method: "GET",
    headers: headers(),
  });
  const invitations: Array<Invitation> = await res.json();

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
