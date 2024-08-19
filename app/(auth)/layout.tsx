import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ AuthLayout ~ session:", session);
  if (session?.user) {
    return redirect("/");
  }
  return <section>{children}</section>;
}
