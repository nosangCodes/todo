"use client";
import React from "react";
import ActionTooltip from "./action-tooltop";
import { Users } from "lucide-react";
import { useAppDispatch } from "@/lib/redux-hooks";
import { openModal } from "@/featuires/modal/modal-slice";

type Props = {
  projectId: string;
  allowedToInvite: boolean;
};

export default function ProjectMembersAction({
  projectId,
  allowedToInvite,
}: Props) {
  const dispatch = useAppDispatch();
  return (
    <ActionTooltip label="Project members">
      <button
        onClick={() => {
          dispatch(
            openModal({
              type: "projectMembers",
              data: {
                projectId,
                allowedToInvite
              },
            })
          );
        }}
        className="group transition-colors hover:bg-slate-800 rounded-full p-2"
      >
        <Users className="h-4 w-4 transition-colors text-slate-400 group-hover:text-slate-100" />
      </button>
    </ActionTooltip>
  );
}
