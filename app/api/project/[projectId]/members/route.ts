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

    if (!params.projectId) {
      return new NextResponse("Bad request", { status: 401 });
    }

    const projectCreator = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      select: {
        createdBy: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });

    const result = await prisma.projectMember.findMany({
      where: {
        projectId: params.projectId,
      },
      select: {
        user: {
          select: {
            email: true,
            name: true,
            id: true,
          },
        },
      },
    });

    const members = result.map((member) => ({
      ...member?.user,
      creator: false,
    }));

    if (projectCreator?.createdBy.id) {
      members.push({ ...projectCreator.createdBy, creator: true });
    }

    return NextResponse.json(members );
  } catch (error) {
    return new NextResponse("Internal server error.", { status: 500 });
  }
};
