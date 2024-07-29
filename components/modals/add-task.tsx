"use client";
import React from "react";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { closeModal } from "@/featuires/modal/modal-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { addTask } from "@/featuires/task/task-slice";

type Props = {};
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Task name is required",
  }),
  priority: z.enum(["1", "2", "3", "4"], {
    message: "Priority is required",
  }),
  duedate: z.date({
    required_error: "A due date is required",
  }),
  projectId: z.string().optional(),
});

export default function AddTaskModal({}: Props) {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "addTask";
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.project);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(
      addTask({
        ...values,
        completed: false,
        duedate: values.duedate.toISOString(),
      })
    );
    form.reset();
    dispatch(closeModal());
  };

  return (
    <Dialog onOpenChange={() => dispatch(closeModal())} open={isModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Task name <sup className="text-rose-600">*</sup></FormLabel>
                  <FormControl className="!mt-0.5">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Priority <sup className="text-rose-600">*</sup></FormLabel>
                  <Select
                    name="priority"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="!mt-0.5">
                      <SelectTrigger
                        className={cn(!field.value && "text-muted-foreground")}
                      >
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={"1"}>Critical</SelectItem>
                        <SelectItem value={"2"}>High</SelectItem>
                        <SelectItem value={"3"}>Medium</SelectItem>
                        <SelectItem value={"4"}>Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duedate"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mt-1 text-sm">Due date <sup className="text-rose-600">*</sup></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild className="w-full text-left">
                      <FormControl className="!mt-0.5">
                        <Button
                          variant={"outline"}
                          type="button"
                          className="font-normal w-full flex justify-start gap-x-4 text-muted-foreground"
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
                        onSelect={field.onChange}
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
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Project</FormLabel>
                  <Select
                    name="priority"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                        <SelectItem value={"NOT_RELATED"}>None</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
