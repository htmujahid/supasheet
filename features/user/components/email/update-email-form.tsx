"use client";

import type { User } from "@supabase/supabase-js";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { If } from "@/components/makerkit/if";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "@/lib/supabase/hooks/use-update-user-mutation";

import { UpdateEmailSchema } from "../../lib/schema/update-email.schema";

function createEmailResolver(currentEmail: string) {
  return zodResolver(
    UpdateEmailSchema.refine((schema) => {
      return schema.email !== currentEmail;
    }),
  );
}

export function UpdateEmailForm({
  user,
  callbackPath,
}: {
  user: User;
  callbackPath: string;
}) {
  const updateUserMutation = useUpdateUser();

  const updateEmail = ({ email }: { email: string }) => {
    // then, we update the user's email address
    const promise = async () => {
      const redirectTo = new URL(
        callbackPath,
        window.location.origin,
      ).toString();

      await updateUserMutation.mutateAsync({ email, redirectTo });
    };

    toast.promise(promise, {
      success: "Email update request successful",
      loading: "Updating your email...",
      error: "Email not updated. Please try again",
    });
  };

  const currentEmail = user.email;

  const form = useForm({
    resolver: createEmailResolver(currentEmail!),
    defaultValues: {
      email: "",
      repeatEmail: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className={"flex flex-col space-y-4"}
        data-test={"account-email-form"}
        onSubmit={form.handleSubmit(updateEmail)}
      >
        <If condition={updateUserMutation.data}>
          <Alert variant={"success"}>
            <CheckIcon className={"h-4"} />

            <AlertTitle>Email update request successful</AlertTitle>

            <AlertDescription>
              We sent you an email to confirm your new email address. Please
              check your inbox and click on the link to confirm your new email
              address.
            </AlertDescription>
          </Alert>
        </If>

        <div className={"flex flex-col space-y-4"}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your New Email</FormLabel>

                <FormControl>
                  <Input
                    data-test={"account-email-form-email-input"}
                    required
                    type={"email"}
                    placeholder={""}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            name={"email"}
          />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Email</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    data-test={"account-email-form-repeat-email-input"}
                    required
                    type={"email"}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            name={"repeatEmail"}
          />

          <div>
            <Button disabled={updateUserMutation.isPending}>
              Update Email Address
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
