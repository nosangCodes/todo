"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { closeModal, openModal } from "@/featuires/modal/modal-slice";
import { ScrollArea } from "../ui/scroll-area";
import {
  clearProjectMembers,
  fetchProjectMembers,
} from "@/featuires/project/project-members.slice";
import { Button } from "../ui/button";
import { Crown } from "lucide-react";

type Props = {};

export default function ProjectMembersList({}: Props) {
  const {
    isOpen,
    type,
    data: { projectId },
  } = useAppSelector((state) => state.modal);

  const { members, loading: loadingMembers } = useAppSelector(
    (state) => state.projectMembers
  );
  const isModalOpen = isOpen && type === "projectMembers";

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectId && isModalOpen) {
      dispatch(fetchProjectMembers({ projectId }));
    }
    return () => {
      dispatch(clearProjectMembers());
    };
  }, [projectId]);

  if (!projectId) return null;

  return (
    <Dialog onOpenChange={() => dispatch(closeModal())} open={isModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2>Members</h2>
          </DialogTitle>
        </DialogHeader>
        {loadingMembers ? (
          <p className="animate-pulse">Loading...</p>
        ) : members.length < 1 ? (
          <div className="flex flex-col gap-y-1">
            <p className="text-slate-500 text-sm font-semibold">
              No members available.
            </p>
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => dispatch(openModal({ type: "inviteUser" }))}
            >
              Invite members
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[500px]">
              <ul className="flex flex-col gap-y-1">
                {members?.map((member) => (
                  <li
                    key={member.id}
                    className="bg-slate-900 rounded-sm p-2 flex flex-row justify-between items-center"
                  >
                    <p className="text-sm">{member.name}</p>
                    {member.creator && <Crown className="h-5 w-5" />}
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => dispatch(openModal({ type: "inviteUser" }))}
            >
              Invite members
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
