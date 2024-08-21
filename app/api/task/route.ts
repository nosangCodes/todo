import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const type = req.nextUrl.searchParams.get("type");

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: "Inavlid qyery" }, { status: 400 });
    }

    if (type === "today" || type === "upcoming") {
      const todaysDate = new Date();
      todaysDate.setHours(0, 0, 0, 0);
      const tomorrowsDate = new Date();
      tomorrowsDate.setHours(0, 0, 0, 0);
      tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);

      const upcoming = await prisma.task.findMany({
        take: type === "today" ? 5 : 15,
        where: {
          dueDate: {
            gt: tomorrowsDate,
          },
          OR: [
            {
              userId: user.id,
            },
            {
              assignedToId: user.id,
            },
          ],
        },
        orderBy: [
          {
            priority: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        include: {
          assignedTo: {
            select: {
              name: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (type === "today") {
        const past = await prisma.task.findMany({
          take: 5,
          where: {
            dueDate: {
              lt: todaysDate,
            },
            OR: [
              {
                userId: user.id,
              },
              {
                assignedToId: user.id,
              },
            ],
          },
          orderBy: [
            {
              priority: "asc",
            },
            {
              createdAt: "desc",
            },
          ],
          include: {
            assignedTo: {
              select: {
                name: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const today = await prisma.task.findMany({
          take: 5,
          where: {
            dueDate: {
              gte: todaysDate,
              lte: tomorrowsDate,
            },
            OR: [
              {
                userId: user.id,
              },
              {
                assignedToId: user.id,
              },
            ],
          },
          orderBy: [
            {
              priority: "asc",
            },
            {
              createdAt: "desc",
            },
          ],
          include: {
            assignedTo: {
              select: {
                name: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        return NextResponse.json({
          today,
          upcoming,
          pastDueDate: past,
        });
      } else if (type === "upcoming") {
        return NextResponse.json({ upcoming });
      }
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
      dueDate: Date;
      projectId?: string;
      assignedToEmail?: string;
      memberId?: string;
      assignedToId?: string;
    } = await req.json();

    if (data?.memberId && data?.projectId) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: data.memberId,
        },
      });

      if (!assignedUser?.id) {
        return NextResponse.json(
          { error: "Member user not found" },
          { status: 400 }
        );
      }

      // check if user is member of project
      const isMemberOfProject = await prisma.projectMember.findFirst({
        where: {
          projectId: data.projectId,
          userId: assignedUser.id,
        },
      });

      if (!isMemberOfProject) {
        return NextResponse.json(
          { error: "user is not a member of project" },
          { status: 400 }
        );
      }

      data["assignedToId"] = assignedUser.id;
      delete data.memberId;
    }

    const dbDueDate = new Date();
    const dueDate = new Date(data.dueDate);

    // Set time to midnight to avoid any time zone issues
    dbDueDate.setHours(0, 0, 0, 0);

    // Set the correct year, month, and date
    dbDueDate.setFullYear(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );
    const newTask = await prisma.task.create({
      data: {
        ...data,
        userId: user.id,
        dueDate: dbDueDate,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("CREATE_TASK_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
