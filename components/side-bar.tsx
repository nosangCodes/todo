"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "./ui/separator";
import { DiamondPlus, PlusIcon } from "lucide-react";
import { openModal } from "@/featuires/modal/modal-slice";
import { useAppDispatch } from "@/lib/redux-hooks";
import Link from "next/link";
import ProjectList from "./project-list";

type Props = {
  className?: string;
};

type ItemProps = {
  name: string;
  link: string;
};

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
  return (
    <div
      className={cn(
        className,
        `w-[260px] flex flex-col h-full px-2 py-4 dark:bg-zinc-900/40 text-zinc-300`
      )}
    >
      <h1 className="text-2xl font-semibold">Todo</h1>
      <Separator className="my-2" />
      <ul className="flex flex-1 flex-col gap-y-2 first:mb-0">
        <li className="mb-0">
          <button
            onClick={() => {
              dispatch(openModal("addTask"));
            }}
            className="flex p-2 pl-0 pb-0  rounded-md transition-colors text-emerald-400 hover:text-emerald-300 flex-row w-full text-center text-sm font-semibold items-center gap-x-1"
          >
            <DiamondPlus className="h-5 w-5" />
            New task
          </button>
        </li>
        <li>
          <SideBarItem link="today" name="Today" />
        </li>
        <li>
          <SideBarItem link="upcoming" name="Upcoming" />
        </li>
        <Separator />
        <li>
          <div className="flex items-center flex-row justify-between">
            <h3 className="text-sm font-semibold text-slate-300">
              My Projects
            </h3>
            <button
              onClick={() => {
                dispatch(openModal("addProject"));
              }}
              className="group"
            >
              <PlusIcon className="group-hover:text-slate-100 transition-colors text-slate-500 h-4 w-4" />
            </button>
          </div>
          <ProjectList className="ml-2 mt-3 flex flex-col gap-y-3" />
        </li>
      </ul>
    </div>
  );
}
