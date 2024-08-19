"use client";
import { UserPlus } from "lucide-react";
import { Tooltip } from "./ui/tooltip";
import ActionTooltip from "./action-tooltop";
import { useAppDispatch } from "@/lib/redux-hooks";
import { openModal } from "@/featuires/modal/modal-slice";
type Props = {
  projectId: string;
};

export default function InviteToProject({ projectId }: Props) {
  const dispatch = useAppDispatch();
  return (
    <ActionTooltip label="Invite user">
      <button
        onClick={() =>
          dispatch(
            openModal({
              type: "inviteUser",
              data: {
                projectId,
              },
            })
          )
        }
        className="group transition-colors hover:bg-slate-800 rounded-full p-2"
      >
        <UserPlus className="h-4 w-4 transition-colors text-slate-400 group-hover:text-slate-100" />
      </button>
    </ActionTooltip>
  );
}
