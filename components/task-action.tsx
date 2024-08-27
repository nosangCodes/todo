"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux-hooks";
import { fetchTasks } from "@/featuires/task/task-slice";

type Props = {
  className?: string;
  status: "pending" | "completed";
  dueDate: Date;
  id: string;
};

const formSchema = z
  .object({
    status: z.enum(["pending", "completed"]),
    dueDate: z.date().optional(),
    time: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "pending" && !data.dueDate) {
        return false;
      }
      return true;
    },
    {
      message: "A due date is required",
      path: ["dueDate"],
    }
  );

export default function TaskAction({ className, dueDate, status, id }: Props) {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const path = pathName.slice(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: status,
      dueDate: new Date(dueDate),
      time: (() => {
        const date = new Date(dueDate);
        const hours = date.getHours().toString().padStart(2, "0");
        const mins = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${mins}`;
      })(),
    },
  });

  const loading = form.formState.isSubmitting;

  const statusIsCompleted = form.watch("status") === "completed";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: {
      completed: boolean;
      dueDate?: string;
    } = {
      completed: values.status === "completed",
    };

    let dueDate: Date;
    if (!statusIsCompleted && values.dueDate) {
      dueDate = new Date(values.dueDate);
      if (values?.time) {
        const [hours, minutes] = values.time.split(":").map(Number);
        // Set the hours and minutes of the dueDate object
        dueDate.setHours(hours, minutes, 0, 0);
      }
      data["dueDate"] = dueDate?.toISOString();
    } else {
      delete data.dueDate;
    }

    const res = await axios.patch(`/api/task/single/${id}`, data);
    console.log("UPDATE TASK RESPONSE", res.data);
    if (res.status) {
      dispatch(fetchTasks({ type: path }));
    }
  };
  return (
    <div className={cn("bg-slate-800 pb-2 px-3", className)}>
      <h3>Actions</h3>
      <Form {...form}>
        <form
          className="mt-1 flex flex-col gap-y-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Status</FormLabel>
                <Select
                  name="status"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl className="!mt-0.5">
                    <SelectTrigger
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"pending"}>Pending</SelectItem>
                      <SelectItem value={"completed"}>Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!statusIsCompleted && (
            <>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="mt-1 text-sm">Due date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="w-full text-left">
                        <FormControl className="!mt-0.5">
                          <Button
                            variant={"outline"}
                            type="button"
                            className="font-normal w-full flex justify-start gap-x-4 hover:bg-slate-950"
                          >
                            <span>
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </span>
                            <CalendarIcon className="h-4 w-4 ml-auto font-semibold" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Time</FormLabel>
                    <FormControl className="!mt-0.5">
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            disabled={loading}
            variant={"outline"}
            className={cn(
              "mt-2 hover:border-white/70 text-sm ml-auto w-fit",
              loading && "animate-pulse"
            )}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
