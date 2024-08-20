"use client";
import {
  clearProjectTasks,
  fetchProjectTasks,
} from "@/featuires/project/project-tasks-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import React, { useEffect } from "react";
import Tasks from "./tasks";
type Props = {
  projectId: string;
};

export default function ProjectTasks({ projectId }: Props) {
  const dispatch = useAppDispatch();
  const { loading, projectTasks } = useAppSelector(
    (state) => state.projectTasks
  );

  useEffect(() => {
    if (dispatch) {
      const controller = new AbortController();
      const signal = controller.signal;

      dispatch(fetchProjectTasks({ projectId, signal }));

      return () => {
          controller.abort(); // Cancels the fetch request if it’s still pending
          dispatch(clearProjectTasks());
      };
    }
  }, [projectId]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <Tasks tasks={projectTasks?.tasks} />
    </div>
  );
}
