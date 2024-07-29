"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { closeModal } from "@/featuires/modal/modal-slice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { addNewProject } from "@/featuires/project/project-slice";
type Props = {};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Project name is required",
  }),
});

export default function AddProjectModal({}: Props) {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const { projects } = useAppSelector((state) => state.project);
  const isModalOpen = isOpen && type === "addProject";
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const projectFound = projects.some(
      (project) => project.name === values.name
    );
    if (projectFound) {
      form.setError("name", {
        type: "value",
        message: "Project name already in use",
      });
    } else {
      dispatch(addNewProject(values));
      dispatch(closeModal());
      form.reset();
    }
  };

  return (
    <Dialog onOpenChange={() => dispatch(closeModal())} open={isModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
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
                  <FormLabel>
                    Name <sup>*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
