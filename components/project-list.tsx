"use client";
import { fetchProjects } from "@/featuires/project/project-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import { Rows2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {
  className?: string;
};

export default function ProjectList({ className }: Props) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchProjects());
    }
  }, []);

  const { projects, loading } = useAppSelector((state) => state.project);
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
      {loading && (
        <li className="h-6 rounded-md px-2 py-1 animate-pulse w-full bg-slate-800">
          <p className="text-xs font-light">Loading...</p>
        </li>
      )}
    </ul>
  );
}
