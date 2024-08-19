"use client";
import React, { useEffect } from "react";
import Tasks from "./tasks";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { fetchTasks, upcomingTasks } from "@/featuires/task/task-slice";
type Props = {};

export default function UpcomingTasks({}: Props) {
  const upcoming = useAppSelector(upcomingTasks);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.task);
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchTasks());
    }
  }, []);

  if (loading) return <h3>Loading...</h3>;
  return <Tasks tasks={upcoming} />;
}
