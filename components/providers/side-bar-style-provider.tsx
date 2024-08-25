"use client";
import { useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import React from "react";
type Props = {
  children: React.ReactNode;
};

export default function SideBarStyleProvider({ children }: Props) {
  const { width, isOpen } = useAppSelector((state) => state.sideBar);
  return (
    <div
      className={cn("flex-1 pr-4", !isOpen && "pl-3")}
      style={{ marginLeft: width }}
    >
      {children}
    </div>
  );
}
