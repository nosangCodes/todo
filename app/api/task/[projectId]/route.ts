import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { projectId: string } }
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        tasks: {
          select: {
            id: true,
            name: true,
            priority: true,
            dueDate: true,
            completed: true,
            completedOn: true,
            createdAt: true,
            assignedTo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("ERROR_FETCHING_PROJECT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
