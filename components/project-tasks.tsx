"use client";
import { fetchProjectTasks } from "@/featuires/project/project-tasks-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import React, { useEffect } from "react";
import Tasks from "./tasks";
type Props = {
  projectId: string;
};

export default function ProjectTasks({ projectId }: Props) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchProjectTasks(projectId));
    }
  }, []);

  const { loading, projectTasks } = useAppSelector(
    (state) => state.projectTasks
  );

  if(loading){
    return <h3>Loading...</h3>
  }

  return (
    <div>
      <Tasks tasks={projectTasks?.tasks} />
    </div>
  );
}
