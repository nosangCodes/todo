import MobileSideBar from "@/components/mobile-sidebar";
import SideBarStyleProvider from "@/components/providers/side-bar-style-provider";
import SideBar from "@/components/side-bar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

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
      <SideBar className="fixed left-0 inset-y-0 max-md:hidden" />
      <SideBarStyleProvider>
        <div>{children}</div>
      </SideBarStyleProvider>
      <MobileSideBar className="md:hidden" />
    </section>
  );
}
