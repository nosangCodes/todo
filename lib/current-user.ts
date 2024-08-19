import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import prisma from "./prisma";

export default async function currentUser() {
  try {
    const session = await getServerSession(authOptions);
    console.log("🚀 ~ currentUser ~ session:", session)
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
