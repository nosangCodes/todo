import { Menu } from "lucide-react";
import React from "react";
import ActionTooltip from "./action-tooltop";
import { Button } from "./ui/button";

type Props = {};

export default function FloatingAction({}: Props) {
  return (
    <div className="md:hidden flex justify-center items-center  w-10 h-10 rounded-full bg-white/50 hover:bg-white transition-colors">
      <ActionTooltip label="Actions">
        <Menu stroke="black" />
      </ActionTooltip>
    </div>
  );
}
