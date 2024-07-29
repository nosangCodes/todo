import SideBar from "@/components/side-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <section className="flex flex-row gap-x-2">
      <SideBar className="fixed left-0 inset-y-0" />
      <div className="ml-[280px] flex-1 pr-4">{children}</div>
    </section>
  );
}
