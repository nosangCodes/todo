"use client";
import { setSideBarState } from "@/featuires/side.slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
type Props = {
  children: React.ReactNode;
};

export default function SideBarStyleProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (window.localStorage) {
      const sideBarState = Boolean(
        JSON.parse(window.localStorage.getItem("tasks-sidebar-state") as string)
      );
      dispatch(setSideBarState({ isOpen: sideBarState }));
    }
  }, []);

  return (
    <div className={cn(`flex-1 pr-4 pl-3 md:ml-[260px]`)}>
      {children}
    </div>
  );
}
