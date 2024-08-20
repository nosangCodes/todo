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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // the user user trying to access should be creator or member
    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

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

    const isCreator = project?.userId === user.id;
    if (!isMember && !isCreator) {
      return NextResponse.json(
        {
          error:
            "Access denied: You must be a member or the creator of the project.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("ERROR_FETCHING_PROJECT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
