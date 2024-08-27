import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: { taskId: string };
  }
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data: {
      completed: boolean;
      dueDate?: string;
    } = await req.json();

    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
      },
    });

    if (!task?.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        ...data,
        completedOn: !data.completed ? null : new Date(),
        completedByUserId: !data.completed ? null : user.id,
      },
    });

    return NextResponse.json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.log("ERROR UPDATING TASK", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
