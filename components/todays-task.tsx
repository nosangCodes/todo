"use client";
import React, { useEffect } from "react";
import Tasks from "./tasks";
import {
  fetchTasks,
} from "@/featuires/task/task-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";

type Props = {};

export default function TodaysTasks({}: Props) {
  const dispatch = useAppDispatch();
  const { loading, today, upcoming, pastDueDate } = useAppSelector(
    (state) => state.task
  );
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchTasks({ type: "today" }));
    }
  }, []);

  if (loading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div className="flex flex-col gap-y-2 pr-2">
      <div>
        <h2 className="text-base font-semibold text-stone-300">Due Today</h2>
        <Tasks className="mt-1" tasks={today} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-stone-300">
          Past due date
        </h2>
        <Tasks className="mt-1" tasks={pastDueDate} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-stone-300">Upcoming</h2>
        <Tasks className="mt-1" tasks={upcoming} />
      </div>
    </div>
  );
}
