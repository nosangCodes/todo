"use client";
import React, { useEffect, useState } from "react";
import ProjectTasks from "@/components/project-tasks";
import { Project } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import InviteToProject from "@/components/invite-to-project";
import ProjectMembersAction from "@/components/project-members-action";

type Props = {
  params: {
    projectid: string;
  };
};

export default function page({ params: { projectid } }: Props) {
  const [projectDetails, setProjectDetails] = useState<Project | null>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (projectid) {
      setLoading(true);
      const fetchProjectDetails = async () => {
        try {
          const res = await fetch(`/api/project/${projectid}`, {
            cache: "no-cache",
            method: "GET",
          });
          const project: Project = await res.json();
          setProjectDetails(project);
        } catch (error) {
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

  return (
    <section className="w-full pt-4 h-[calc(100vh-50px)]">
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold text-2xl">
          {loading ? "Loading..." : projectDetails?.name}
        </h2>
        <div className="flex flex-row">
          <ProjectMembersAction projectId={projectid} />
          <InviteToProject projectId={projectid} />
        </div>
      </div>
      <Separator className="my-2" />
      <ProjectTasks projectId={projectid} />
    </section>
  );
}
