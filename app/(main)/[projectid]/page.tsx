import React from "react";
import ProjectTasks from "@/components/project-tasks";
import { Project } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import InviteToProject from "@/components/invite-to-project";
import ProjectMembersAction from "@/components/project-members-action";
import { headers } from "next/headers";

type Props = {
  params: {
    projectid: string;
  };
};

export default async function page({ params: { projectid } }: Props) {
  const res = await fetch(
    `${process.env.FRONTEND_URL}/api/project/${projectid}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  );
  const project: Project = await res.json();

  return (
    <section className="w-full pt-4 h-[calc(100vh-50px)]">
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold text-2xl">{project.name}</h2>
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
