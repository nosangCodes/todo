import SideBar from "@/components/side-bar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/auth/sign-in");
  }
  return (
    <section className="flex flex-row gap-x-2">
      <SideBar className="fixed left-0 inset-y-0" />
      <div className="ml-[280px] flex-1 pr-4">{children}</div>
    </section>
  );
}
