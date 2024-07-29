"use client";
import React from "react";
import Tasks from "./tasks";
import { useAppSelector } from "@/lib/redux-hooks";
import { upcomingTasks } from "@/featuires/task/task-slice";
type Props = {};

export default function UpcomingTasks({}: Props) {
  const upcoming = useAppSelector(upcomingTasks);
  return <Tasks tasks={upcoming} />;
}
