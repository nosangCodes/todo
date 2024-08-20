"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { closeModal } from "@/featuires/modal/modal-slice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MultipleInput from "../multiple-input";
import { Button } from "../ui/button";
import { validateEmail } from "@/lib/validate-email";
import { Loader2 } from "lucide-react";
import axios from "axios";

type Props = {};

const formSchema = z.object({
  emails: z.array(z.string()).min(1, {
    message: "Atleast one email is required!",
  }),
});

export default function InviteUserModal({}: Props) {
  const { isOpen, type, data } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "inviteUser";
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (data?.projectId) {
        await axios.post(`/api/project/${data?.projectId}/invite`, {
          ...values,
          projectId: data.projectId,
        });
        form.reset();
        dispatch(closeModal());
      } else {
        form.setError("root", { message: "Invalid URL" });
      }
    } catch (error) {
      form.setError("root", { message: "Something went wrong!" });
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
        dispatch(closeModal());
      }}
      open={isModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emails</FormLabel>
                  <FormControl>
                    <MultipleInput
                      onChange={(value: string, clearValue?: () => void) => {
                        form.clearErrors("emails");
                        if (validateEmail(value)) {
                          if (clearValue) {
                            clearValue();
                          }
                          const values = field.value ?? [];
                          values.push(value);
                          field.onChange(values);
                        } else {
                          form.setError("emails", { message: "Invalid email" });
                        }
                      }}
                      values={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  "Invite"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
