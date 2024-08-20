"use client";
import React, { useEffect, useState } from "react";
import ProjectTasks from "@/components/project-tasks";
import { Project } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import InviteToProject from "@/components/invite-to-project";
import ProjectMembersAction from "@/components/project-members-action";
import { cn } from "@/lib/utils";

type Props = {
  params: {
    projectid: string;
  };
};

export default function page({ params: { projectid } }: Props) {
  const [projectDetails, setProjectDetails] = useState<Project | null>();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number>();

  useEffect(() => {
    setMounted(true);
    if (projectid) {
      setLoading(true);
      const fetchProjectDetails = async () => {
        try {
          const res = await fetch(`/api/project/${projectid}`, {
            cache: "no-cache",
            method: "GET",
          });

          if (res.status === 403) {
            throw new Error("403");
          }

          const project: Project = await res.json();
          setProjectDetails(project);
        } catch (error) {
          setError(error as number);
          console.error("ERROR FETCHING PROJECT DETAILS", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProjectDetails();
    }
    return () => {
      setProjectDetails(null);
    };
  }, [projectid]);

  if (!mounted) return null;

  console.log("🚀 ~ page ~ error:", error);
  console.log("🚀 ~ page ~ error === 403:", error === 403);
  if (error) {
    return (
      <section className="w-full flex justify-center items-center h-screen">
        <h5 className="text-red-500 text-muted-foreground text-base font-medium">
          Access denied: You must be a member or the creator of the project.
        </h5>
      </section>
    );
  }

  return (
    <section className="w-full pt-4 h-[calc(100vh-50px)]">
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold text-2xl">
          {loading ? "Loading..." : projectDetails?.name}
        </h2>
        <div className={cn("flex flex-row", loading && "hidden")}>
          <ProjectMembersAction projectId={projectid} />
          <InviteToProject projectId={projectid} />
        </div>
      </div>
      <Separator className="my-2" />
      {projectDetails?.id && <ProjectTasks projectId={projectid} />}
    </section>
  );
}
