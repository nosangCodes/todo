"use client";
import React, { useEffect, useState } from "react";
import SideBar from "./side-bar";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import FloatingAction from "./floating-action";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type Props = {
  className?: string;
};

export default function MobileSideBar({ className }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-6 left-5" asChild>
        <button>
          <FloatingAction />
        </button>
      </SheetTrigger>
      <SheetClose />
      <SheetContent className={cn(className, "md:w-fit p-1")}>
        <SideBar />
      </SheetContent>
    </Sheet>
  );
}
