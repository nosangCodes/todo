"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "./ui/separator";
import { Cross, DiamondPlus, PlusIcon } from "lucide-react";
import { openModal } from "@/featuires/modal/modal-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import Link from "next/link";
import ProjectList from "./project-list";
import UserCard from "./user-card";
import { ScrollArea } from "./ui/scroll-area";
import { toggleSideBar } from "@/featuires/side.slice";

type Props = {
  className?: string;
};

type ItemProps = {
  name: string;
  link: string;
};

const mainTasks = [
  {
    name: "Today",
    link: "today",
  },
  {
    name: "Upcoming",
    link: "upcoming",
  },
  {
    name: "Invitations",
    link: "invitations",
  },
];

function SideBarItem({ name, link }: ItemProps) {
  return (
    <Link href={link}>
      <div className="p-2 cursor-pointer bg-slate-700/30 rounded-md shadow-md hover:shadow-lg hover:bg-slate-700/35 transition-all">
        <p className="text-sm font-medium">{name}</p>
      </div>
    </Link>
  );
}

export default function SideBar({ className }: Props) {
  const dispatch = useAppDispatch();
  const { isOpen, width } = useAppSelector((state) => state.sideBar);
  return (
    <div
      style={{ width }}
      className={cn(
        className,
        ` flex flex-col h-full px-2 pb-2 pt-4 dark:bg-zinc-900/40 text-zinc-300`,
        !isOpen && "overflow-x-hidden"
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold">Todo</h1>
        <button onClick={() => dispatch(toggleSideBar())}>
          <Cross />
        </button>
      </div>
      <Separator className="my-2" />
      <button
        onClick={() => {
          dispatch(openModal({ type: "addTask" }));
        }}
        className="flex p-2 pl-0 pb-0  rounded-md transition-colors text-emerald-400 hover:text-emerald-300 flex-row w-full text-center text-sm font-semibold items-center gap-x-1"
      >
        <DiamondPlus className="h-5 w-5" />
        New task
      </button>
      <ul className="my-2 flex flex-col gap-y-2 first:mb-0">
        {mainTasks?.map((task) => (
          <SideBarItem link={task.link} name={task.name} />
        ))}
      </ul>
      <Separator className="h-[0.3px]" />
      <ScrollArea className="flex-1">
        <ul className="mt-3 flex  flex-col gap-y-2 first:mb-0">
          <li>
            <div className="flex items-center flex-row justify-between">
              <h3 className="text-sm font-semibold text-slate-300">
                My Projects
              </h3>
              <button
                onClick={() => {
                  dispatch(openModal({ type: "addProject" }));
                }}
                className="group rounded-full p=1 hover:bg-slate-800 mr-3"
              >
                <PlusIcon
                  strokeWidth={2}
                  className="group-hover:text-slate-100 transition-colors text-slate-500 h-4 w-4"
                />
              </button>
            </div>
            <ProjectList className="ml-2 mt-3 flex flex-col gap-y-3" />
          </li>
          <li>
            <Separator />
          </li>
          <li>
            <div className="flex items-center flex-row justify-between">
              <h3 className="text-sm font-semibold text-slate-300">
                Collab Projects
              </h3>
            </div>
            <ProjectList
              collabProject={true}
              className="ml-2 mt-3 flex flex-col gap-y-3"
            />
          </li>
        </ul>
      </ScrollArea>
      <Separator className="my-2" />
      <UserCard />
    </div>
  );
}
