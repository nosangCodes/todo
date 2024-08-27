"use client";
import { completeTask } from "@/featuires/task/task-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import { format, formatDistance, subDays } from "date-fns";
import { CheckCircle, ChevronDown, Circle } from "lucide-react";

import React, { useState } from "react";
import { Button } from "./ui/button";
import TaskAction from "./task-action";
type Props = {
  className?: string;
  tasks?: Task[];
};

export default function Tasks({ className, tasks }: Props) {
  return (
    <div className={cn(className)}>
      <ul className="flex flex-col gap-y-2">
        {tasks && tasks.length > 0 ? (
          tasks?.map((task) => (
            <li key={task.id} className="">
              <TaskItem {...task} />
            </li>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No tasks</p>
        )}
      </ul>
    </div>
  );
}

export function TaskItem(task: Task) {
  const dispatch = useAppDispatch();
  const [actionExpanded, setActionExpanded] = useState(false);

  const priorityClasses = {
    "1": "bg-[#0D7C66]",
    "2": "bg-[#41B3A2] text-[#973131]",
    "3": "bg-[#BDE8CA] text-[#1E2A5E]",
    "4": "",
  };

  const zonedDate = new Date(task.dueDate);

  const formattedUtcTime = format(zonedDate, "PPP hh:mm a");
  const timeDistance = formatDistance(zonedDate, new Date(), {
    addSuffix: true,
  });

  const handleToggleActionExpand = () => {
    setActionExpanded((prev) => !prev);
  };

  return (
    <React.Fragment>
      <div
        className={cn(
          "cursor-pointer flex flex-row gap-x-2 p-2 flex-1 items-start  bg-slate-800 rounded-sm",
          priorityClasses[task?.priority],
          task.completed && "bg-green-700 !text-white"
        )}
      >
        <button
          className="!mt-[6px]"
          onClick={() => {
            if (!task.completed) {
              dispatch(completeTask(task.id));
            }
          }}
        >
          {task.completed ? (
            <CheckCircle className="text-white-600 h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        <div className="flex w-full flex-1 flex-col items-start justify-start md:flex-row md:justify-between">
          <div className="flex max-md:w-full flex-col">
            <p className="text-lg font-semibold">{task.name}</p>
            <p className="text-sm font-medium">{formattedUtcTime}</p>
            <p className="text-sm font-medium">{timeDistance}</p>
          </div>
          <div className="flex max-md:w-full h-full flex-col">
            <div className="flex-1">
              {task.project?.name && (
                <p className="text-xs">
                  Project:{" "}
                  <span className="font-semibold text-sm">
                    {task.project.name}
                  </span>
                </p>
              )}
              {task.assignedTo?.name && (
                <p className="text-xs">
                  Asigned to:{" "}
                  <span className="font-semibold text-sm">
                    {task.assignedTo.name}
                  </span>
                </p>
              )}
              {task.createdBy?.name && (
                <p className="text-xs">
                  Created by:{" "}
                  <span className="font-semibold text-sm">
                    {task.createdBy.name}
                  </span>
                </p>
              )}
              {task.completed && task?.completedOn && (
                <p className="text-xs">
                  Completed on:{" "}
                  <span className="font-semibold text-sm">
                    {format(task.completedOn, "PPP hh:mm a")}
                  </span>
                </p>
              )}
            </div>
            <Button
              onClick={handleToggleActionExpand}
              className="md:ml-auto mt-2 h-fit w-fit text-xs px-2 py-1"
              size={"sm"}
            >
              Actions
              <span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    actionExpanded ? "rotate-180" : "rotate-0"
                  )}
                />
              </span>
            </Button>
          </div>
        </div>
      </div>
      <TaskAction
        id={task.id}
        status={task.completed ? "completed" : "pending"}
        dueDate={task.dueDate}
        className={cn(
          "pt-2 mt-1 rounded-sm  hidden",
          actionExpanded && "block"
        )}
      />
    </React.Fragment>
  );
}
