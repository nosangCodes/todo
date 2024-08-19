import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const invitations = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        projectInvitations: {
          include: {
            invitedByUser: {
              select: {
                name: true,
                id: true,
                createdAt: true,
              },
            },
            invitedProject: {
              select: {
                name: true,
                id: true,
              },
            },
            projectInvitationResponse: true,
          },
        },
      },
    });

    const result = invitations?.projectInvitations
      .map((invitation) => ({
        id: invitation.id,
        invitedByUser: invitation?.invitedByUser,
        invitedProject: invitation?.invitedProject,
        response: invitation.projectInvitationResponse?.response,
      }))
      .filter((invitation) => invitation.response === "NOT_RESPONDED");

    return NextResponse.json(result);
  } catch (error) {
    console.error("ERROR_FETCHING_INVITATION_LIST", error);
    return new NextResponse("INternal server error", { status: 500 });
  }
};
