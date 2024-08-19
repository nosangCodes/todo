import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const body: {
      emails: string[];
      projectId: string;
      userId?: string;
    } = await req.json();

    let usersInvited: { email: string; id?: string }[] = [];

    if (body.emails && body.emails.length > 0) {
      usersInvited = await Promise.all(
        body.emails.map(async (email) => {
          const user = await prisma.user.findFirst({
            where: {
              email,
            },
          });
    
          return {
            email: email,
            id: user?.id ?? undefined,
          };
        })
      );
    }

    const query = usersInvited.map(({ email, id }) => ({
      invitedEmail: email,
      userId: id,
      projectId: body.projectId,
      invitedByUserId: user.id,
    }));

    const inviteRes = await prisma.projectInvitation.createMany({
      data: query
    });

    return NextResponse.json(inviteRes);
  } catch (error) {
    console.error("ERRRO_INVITING_PEOPLE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
