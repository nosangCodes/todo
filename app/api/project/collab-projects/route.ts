import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collabProjects = await prisma.projectMember.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        project: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });
    const result = collabProjects.map((project) => project.project);

    return NextResponse.json(result);
  } catch (error) {
    console.log("ERROR FETCHING COLLAB PROJECTS", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
