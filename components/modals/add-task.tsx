"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import axios from "axios";
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
import { addTask, fetchTasks } from "@/featuires/task/task-slice";
import { useRouter } from "next/navigation";
import { fetchProjectTasks } from "@/featuires/project/project-tasks-slice";
import {
  clearProjectMembers,
  fetchProjectMembers,
} from "@/featuires/project/project-members.slice";

type Props = {};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Task name is required",
  }),
  priority: z.enum(["1", "2", "3", "4"], {
    message: "Priority is required",
  }),
  dueDate: z.date({
    required_error: "A due date is required",
  }),
  assignedToEmail: z.string().optional(),
  projectId: z.string().optional(),
  memberId: z.string().optional(),
});

export default function AddTaskModal() {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  // const { members, loading: membersLoading } = useAppSelector(
  //   (state) => state.projectMembers
  // );

  // console.log("🚀 ~ AddTaskModal ~ membersLoading:", membersLoading)
 
  const isModalOpen = isOpen && type === "addTask";
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.project);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "none",
    },
  });

  // const isProjectSelected =
  //   Boolean(form.getValues("projectId")) &&
  //   form.getValues("projectId") !== "none";

  const isLoading = form.formState.isSubmitting;

  // useEffect(() => {
  //   const projectId = form.getValues("projectId");
  //   console.log("🚀 ~ useEffect ~ projectId changed:", projectId)
    
  //   if (projectId && projectId !== "none") {
  //     // fetch project members
  //     dispatch(fetchProjectMembers({ projectId }));
  //   }

  //   return () => {
  //     console.log("clearing...");
  //     form.setValue("memberId", "none");
  //     // dispatch(clearProjectMembers());
  //   };
  // }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.projectId === "none") delete values.projectId;
      await axios.post("/api/task", {
        ...values,
      });

      dispatch(fetchTasks());
      if (values.projectId) {
        dispatch(fetchProjectTasks({ projectId: values.projectId }));
      }
      form.reset();
      dispatch(closeModal());
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  };

  if (!isModalOpen) return null;

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
                  <FormLabel className="text-sm">
                    Task name <sup className="text-rose-600">*</sup>
                  </FormLabel>
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
                  <FormLabel className="text-sm">
                    Priority <sup className="text-rose-600">*</sup>
                  </FormLabel>
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
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mt-1 text-sm">
                    Due date <sup className="text-rose-600">*</sup>
                  </FormLabel>
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
                    name="projectId"
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
                        <SelectItem value={"none"}>None</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* {isProjectSelected && (
              <FormField
                control={form.control}
                name="memberId"
                disabled={membersLoading || isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      {membersLoading
                        ? "Assign to (Loading members...)"
                        : "Assign to"}
                    </FormLabel>
                    <Select
                      name="memberId"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="!mt-0.5">
                        <SelectTrigger
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <SelectValue
                            placeholder={
                              membersLoading
                                ? "Loading Members"
                                : "Select Member"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {members?.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                          <SelectItem value={"none"}>None</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            <DialogFooter>
              <Button disabled={isLoading}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
