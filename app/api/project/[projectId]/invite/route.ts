import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
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
    // if user is invited but has not responded update data
    const alreadyInvitedUsers = await prisma.projectInvitation.findMany({
      where: {
        projectId: body.projectId,
        invitedEmail: {
          in: usersInvited.map((user) => user.email),
        },
        projectInvitationResponse: {
          response: {
            in: ["ACCEPTED", "NOT_RESPONDED"],
          },
        },
      },
    });
    console.log("🚀 ~ POST ~ alreadyInvitedUsers:", alreadyInvitedUsers);

    const invitedUsersMailsSet = new Set(
      alreadyInvitedUsers.map((user) => user.invitedEmail)
    );
    console.log("🚀 ~ POST ~ invitedUsersMailsSet:", invitedUsersMailsSet);

    const query = usersInvited
      .map(({ email, id }) => {
        if (invitedUsersMailsSet.has(email)) return;
        return {
          invitedEmail: email,
          userId: id,
          projectId: body.projectId,
          invitedByUserId: user.id,
        };
      })
      .filter((item) => item !== undefined);

    console.log("🚀 ~ query ~ query:", query);

    if (query.length <= 0) {
      return NextResponse.json({ message: "No one to invite" });
    }

    const inviteRes = await prisma.projectInvitation.createMany({
      data: query,
    });

    if (inviteRes.count > 0) {
      // create response entry
      const createdInvitations = await prisma.projectInvitation.findMany({
        where: {
          projectId: body.projectId,
          invitedEmail: {
            in: query.map((invitation) => invitation.invitedEmail),
          },
          projectInvitationResponse: null,
        },
        select: {
          id: true,
        },
      });

      console.log("🚀 ~ POST ~ createdInvitations:", createdInvitations);

      const responseEntries = createdInvitations.map((inv) => ({
        projectInvitationId: inv.id,
      }));
      console.log("🚀 ~ responseEntries ~ responseEntries:", responseEntries);

      const responseResponse =
        await prisma.projectInvitationResponse.createMany({
          data: responseEntries,
        });

      console.log("🚀 ~ POST ~ responseResponse:", responseResponse);
    }

    return NextResponse.json(inviteRes);
  } catch (error) {
    console.error("ERRRO_INVITING_PEOPLE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
