"use client";

import { useTransition } from "react";

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

import { createAccountAction } from "../../lib/actions";
import {
  CreateAccountFormData,
  CreateAccountSchema,
} from "../../lib/schema/create-account.schema";

type CreateAccountFormProps = {
  userRoles: { id: number; account_id: string; role: string }[];
};

export function CreateAccountForm({ userRoles }: CreateAccountFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      email_confirm: false,
      phone_confirm: false,
    },
  });

  const onSubmit = (data: CreateAccountFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        if (data.id) formData.append("id", data.id);
        if (data.email) formData.append("email", data.email);
        if (data.password) formData.append("password", data.password);
        if (data.phone) formData.append("phone", data.phone);
        formData.append("email_confirm", String(data.email_confirm ?? false));
        formData.append("phone_confirm", String(data.phone_confirm ?? false));
        if (data.user_roles && data.user_roles.length > 0) {
          formData.append("user_roles", JSON.stringify(data.user_roles));
        }

        toast.promise(createAccountAction(formData), {
          loading: "Creating account...",
          success: "Account created successfully",
          error: (err) => err.message || "Failed to create account",
        });
      } catch (error) {
        console.error("Error creating account:", error);
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
            name="id"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account ID (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Auto-generated UUID"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty to auto-generate a UUID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  At least one of email or phone is required
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
                  <FormLabel>Auto-confirm email</FormLabel>
                  <FormDescription>
                    If unchecked, account will need to verify their email and
                    password is required
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
                <FormLabel>Password (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Required if email is provided and not auto-confirmed
                </FormDescription>
                <FormMessage />
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
                  At least one of email or phone is required
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
                  <FormLabel>Auto-confirm phone</FormLabel>
                  <FormDescription>
                    If unchecked, account will need to verify their phone number
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="user_roles"
            control={form.control}
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">User Roles</FormLabel>
                  <FormDescription>
                    Select one or more roles to assign to this user
                  </FormDescription>
                </div>
                <div className="space-y-2">
                  {Array.from(new Set(userRoles.map((ur) => ur.role))).map(
                    (role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="user_roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-start space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          role,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {role}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ),
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
