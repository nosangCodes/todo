"use client";
import React, { useEffect } from "react";
import Tasks from "./tasks";
import {
  completedTasks,
  fetchTasks,
  incompleteTasks,
  pastDueDate,
} from "@/featuires/task/task-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";

type Props = {};

export default function TodaysTasks({}: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.task);
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchTasks());
    }
  }, []);

  const completed = useAppSelector(completedTasks);
  const incomplete = useAppSelector(incompleteTasks);
  const past = useAppSelector(pastDueDate);

  if (loading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div className="flex flex-col gap-y-2 pr-2">
      <div>
        <h2 className="text-base font-semibold text-stone-300">In Progress</h2>
        <Tasks className="mt-1" tasks={incomplete} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-stone-300">
          Past due date
        </h2>
        <Tasks className="mt-1" tasks={past} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-stone-300">Completed</h2>
        <Tasks className="mt-1" tasks={completed} />
      </div>
    </div>
  );
}
