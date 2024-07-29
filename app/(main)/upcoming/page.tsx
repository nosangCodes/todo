import { Separator } from "@/components/ui/separator";
import UpcomingTasks from "@/components/upcoming-tasks";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <section className="w-full pt-4 h-[calc(100vh-50px)]">
      <h2 className="font-semibold text-2xl">Upcoming</h2>
      <Separator className="my-2" />
      <div className="h-full overflow-y-scroll pb-10">
        <UpcomingTasks />
      </div>
    </section>
  );
}
