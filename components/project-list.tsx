"use client";
import {
  clearProjects,
  fetchCollabProjects,
  fetchProjects,
} from "@/featuires/project/project-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import { Rows2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  className?: string;
  collabProject?: boolean;
};

export default function ProjectList({ className, collabProject }: Props) {
  const pathName = usePathname();
  const projectId = pathName?.slice(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dispatch) {
      if (collabProject) {
        dispatch(fetchCollabProjects());
      } else {
        dispatch(fetchProjects());
      }
    }
  }, [collabProject]);

  const { projects, loading, collabProjects } = useAppSelector(
    (state) => state.project
  );

  const projectList = collabProject ? collabProjects : projects;

  return (
    <ul className={cn(className)}>
      {projectList?.map((project) => (
        <Link href={project.id} key={project.id}>
          <li
            className={cn(
              "cursor-pointer group",
              projectId === project.id && "bg-slate-800 p-1 rounded-sm"
            )}
          >
            <p className="flex flex-row items-center text-sm transition-colors group-hover:text-fuchsia-500">
              <span className="font-semibold transition-colors group-hover:text-slate-50 text-muted-foreground text-lg mr-1">
                <Rows2 className="h-5 w-5" />
              </span>
              {project.name}
            </p>
          </li>
        </Link>
      ))}
      {!collabProject && loading === "projects" && (
        <>
          <li className="h-6 rounded-md px-2 py-1 animate-pulse w-full bg-slate-800">
            <p className="text-xs font-light">Loading...</p>
          </li>
        </>
      )}
      {collabProject && loading === "collapProjects" && (
        <>
          <li className="h-6 rounded-md px-2 py-1 animate-pulse w-full bg-slate-800">
            <p className="text-xs font-light">Loading...</p>
          </li>
        </>
      )}
    </ul>
  );
}
