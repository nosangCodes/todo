"use client";
import { completeTask } from "@/featuires/task/task-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import { format, formatDistance, subDays } from "date-fns";
import { CheckCircle, Circle } from "lucide-react";
// import { utcToZonedTime } from "date-fns-tz";
import React from "react";
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
  const priorityClasses = {
    "1": "bg-red-600",
    "2": "bg-[#e13728]",
    "3": "bg-[#e65358]",
    "4": "",
  };

  const zonedDate = new Date(task.dueDate);

  // Convert the UTC date to a zoned time (which is still UTC)
  // const zonedDate = utcToZonedTime(utcDate, "UTC");

  // Format the UTC date to a readable string
  const formattedUtcTime = format(zonedDate, "PPP hh:mm a");
  const timeDistance = formatDistance(zonedDate, new Date(), {
    addSuffix: true,
  });
  return (
    <div
      className={cn(
        "cursor-pointer flex flex-row gap-x-2 p-2 flex-1 items-start  bg-slate-800 rounded-sm",
        priorityClasses[task?.priority],
        task.completed && "bg-green-700"
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
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex flex-1 flex-col">
        <p className="text-lg font-normal">{task.name}</p>
        <p className="text-sm font-medium text-muted-foreground">
          {formattedUtcTime}
        </p>
        <p className="text-sm font-medium text-muted-foreground">
          {timeDistance}
        </p>
      </div>
      <div className="ml-auto">
        {task.project?.name && (
          <p className="text-xs">
            Project:{" "}
            <span className="font-semibold text-sm">{task.project.name}</span>
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
            <span className="font-semibold text-sm">{task.createdBy.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
