"use client";
import { completeTask, Task } from "@/featuires/task/task-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle, Circle } from "lucide-react";
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
  return (
    <div
      className={cn(
        "cursor-pointer flex flex-row gap-x-2 p-2 flex-1   bg-slate-800 rounded-sm",
        priorityClasses[task?.priority],
        task.completed && "bg-green-700"
      )}
    >
      <button
        className="mt-1"
        onClick={() => {
          console.log("clicked");
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
      <div className="flex flex-col">
        <p className="text-lg font-normal">{task.name}</p>
        <p className="text-sm font-medium text-muted-foreground">
          {format(task.duedate, "PPP")}
        </p>
      </div>
    </div>
  );
}
