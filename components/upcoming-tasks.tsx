"use client";
import React, { useEffect } from "react";
import Tasks from "./tasks";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { fetchTasks } from "@/featuires/task/task-slice";
type Props = {};

export default function UpcomingTasks({}: Props) {
  const dispatch = useAppDispatch();
  const { loading, upcoming } = useAppSelector((state) => state.task);
  
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchTasks({ type: "upcoming" }));
    }
  }, []);

  if (loading) return <h3>Loading...</h3>;
  return <Tasks tasks={upcoming} />;
}
