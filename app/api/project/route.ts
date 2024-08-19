import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("FETCH_PROJECTS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    const body: {
      name: string;
    } = await req.json();

    const projectNameExist = await prisma.project.findFirst({
      where: {
        name: body.name,
      },
    });

    if (projectNameExist) {
      return new NextResponse("project name already exist'", { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        name: body.name,
        userId: user.id,
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("CREATE_PROJECT_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
