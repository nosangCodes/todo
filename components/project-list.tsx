"use client";
import { useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import { Goal, Rows2 } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  className?: string;
};

export default function ProjectList({ className }: Props) {
  const { projects } = useAppSelector((state) => state.project);
  return (
    <ul className={cn(className)}>
      {projects?.map((project) => (
        <Link href={project.id} key={project.id}>
          <li className="cursor-pointer group">
            <p className="flex flex-row items-center text-sm transition-colors group-hover:text-fuchsia-500">
              <span className="font-semibold transition-colors group-hover:text-slate-50 text-muted-foreground text-lg mr-1">
                <Rows2 className="h-5 w-5" />
              </span>
              {project.name}
            </p>
          </li>
        </Link>
      ))}
    </ul>
  );
}
