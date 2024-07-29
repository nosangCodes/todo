"use client";
import { projectTasks } from "@/featuires/task/task-slice";
import { useAppSelector } from "@/lib/redux-hooks";
import React from "react";

type Props = {
  params: {
    projectid: string;
  };
};

export default function page({ params: { projectid } }: Props) {
  const tasks = useAppSelector((state) =>
    projectTasks(state, {
      payload: projectid,
      type: "",
    })
  );
  return (
    <div>
      Project {projectid}
      {tasks?.map((task) => (
        <p key={task.id}>{task.name}</p>
      ))}
    </div>
  );
}
