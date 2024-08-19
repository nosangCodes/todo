import currentUser from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { InvitationResponse } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const body: {
      projectInvitationId: string;
      projectId: string;
      response: InvitationResponse;
    } = await req.json();

    if (!body.projectInvitationId || !body.response || !body.projectId) {
      return new NextResponse("Bad request", { status: 401 });
    }

    const projectInvitationResponse =
      await prisma.projectInvitationResponse.update({
        where: {
          projectInvitationId: body.projectInvitationId,
        },
        data: {
          response: body.response,
        },
      });

    if (projectInvitationResponse.response === "ACCEPTED") {
      // make them project member

      const alreadyAMember = await prisma.projectMember.findFirst({
        where: {
          projectId:body.projectId,
          userId: user.id,
        },
      });
      
      console.log("🚀 ~ PATCH ~ alreadyAMember:", alreadyAMember)
      if (!alreadyAMember?.id) {
        const projectmember = await prisma.projectMember.create({
          data: {
            userId: user.id,
            projectId: body.projectId,
          },
        });
        console.log("🚀 ~ projectmember:", projectmember);
      }
    }

    return NextResponse.json(projectInvitationResponse);
  } catch (error) {
    console.error("ERRRO_RESPONDING_TO_INVITATION", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
