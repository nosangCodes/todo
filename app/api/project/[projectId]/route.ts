import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { projectId: string } }
) => {
  try {
    if (!params.projectId) {
      return new NextResponse("Bad request", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return new NextResponse("Internal server error.", { status: 500 });
  }
};
