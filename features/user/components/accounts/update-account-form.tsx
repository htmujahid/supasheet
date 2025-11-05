"use client";

import { useTransition } from "react";

import { User } from "@supabase/supabase-js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  UpdateAccountFormData,
  UpdateAccountSchema,
} from "../../lib/schema/update-account.schema";
import { updateAccountAction } from "../../lib/server/server-actions";

type UpdateAccountFormProps = {
  account: User;
};

export function UpdateAccountForm({ account }: UpdateAccountFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateAccountFormData>({
    resolver: zodResolver(UpdateAccountSchema),
    defaultValues: {
      email: account.email || "",
      email_confirm: !!account.email_confirmed_at,
      phone: account.phone || "",
      phone_confirm: !!account.phone,
      password: "",
    },
  });

  const onSubmit = (data: UpdateAccountFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("accountId", account.id);

        if (data.email) formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.password) formData.append("password", data.password);
        if (data.email_confirm !== undefined) {
          formData.append("email_confirm", String(data.email_confirm));
        }
        if (data.phone_confirm !== undefined) {
          formData.append("phone_confirm", String(data.phone_confirm));
        }

        toast.promise(updateAccountAction(formData), {
          loading: "Updating account...",
          success: "Account updated successfully",
          error: (err) => err.message || "Failed to update account",
        });
      } catch (error) {
        console.error("Error updating account:", error);
      }
    });
  };

  return (
    <div className="flex flex-col space-y-8">
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Update the account&apos;s email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email_confirm"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Email confirmed</FormLabel>
                  <FormDescription>
                    Mark the email as confirmed or unconfirmed
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Update the account&apos;s phone number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phone_confirm"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Phone confirmed</FormLabel>
                  <FormDescription>
                    Mark the phone as confirmed or unconfirmed
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Leave empty to keep current password"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Enter a new password only if you want to change it (min 6
                  characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
