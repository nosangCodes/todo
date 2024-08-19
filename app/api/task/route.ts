import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
      include: {
        assignedTo: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET_ALL_TASK_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    const data: {
      name: string;
      priority: string;
      dueDate: string;
      projectId?: string;
      assignedToEmail?: string;
      assignedToId?: string;
    } = await req.json();

    if (data?.assignedToEmail) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          email: data.assignedToEmail,
        },
      });
      if (assignedUser?.id) {
        data["assignedToId"] = assignedUser.id;
      }
    }

    const newTask = await prisma.task.create({
      data: { ...data, userId: user.id },
    });
    console.log("🚀 ~ POST ~ newTask:", newTask);

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("CREATE_TASK_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
