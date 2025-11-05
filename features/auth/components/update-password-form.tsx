"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "@/lib/supabase/hooks/use-update-user-mutation";

import { PasswordResetSchema } from "../lib/schemas/password-reset.schema";

export function UpdatePasswordForm(params: { redirectTo: string }) {
  const updateUser = useUpdateUser();

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  if (updateUser.error) {
    return <ErrorState onRetry={() => updateUser.reset()} />;
  }

  if (updateUser.data && !updateUser.isPending) {
    return <SuccessState redirectTo={params.redirectTo} />;
  }

  return (
    <div className={"flex w-full flex-col space-y-6"}>
      <div className={"flex justify-center"}>
        <Heading level={5} className={"tracking-tight"}>
          Reset Password
        </Heading>
      </div>

      <Form {...form}>
        <form
          className={"flex w-full flex-1 flex-col"}
          onSubmit={form.handleSubmit(({ password }) => {
            return updateUser.mutateAsync({
              password,
              redirectTo: params.redirectTo,
            });
          })}
        >
          <div className={"flex-col space-y-4"}>
            <FormField
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input required type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={"repeatPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat Password</FormLabel>

                  <FormControl>
                    <Input required type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={updateUser.isPending}
              type="submit"
              className={"w-full"}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SuccessState({ redirectTo }: { redirectTo: string }) {
  return (
    <div className={"flex flex-col space-y-4"}>
      <Alert variant={"success"}>
        <CheckIcon className={"s-6"} />

        <AlertTitle>Password update request successful</AlertTitle>

        <AlertDescription>
          Your password has been successfully updated!
        </AlertDescription>
      </Alert>

      <Link href={redirectTo}>
        <Button variant={"outline"} className={"w-full"}>
          <span>Back to Home Page</span>

          <ArrowRightIcon className={"ml-2 h-4"} />
        </Button>
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={"flex flex-col space-y-4"}>
      <Alert variant={"destructive"}>
        <AlertCircleIcon className={"s-6"} />

        <AlertTitle>Sorry, something went wrong.</AlertTitle>

        <AlertDescription>
          Sorry, we could not reset your password. Please try again.
        </AlertDescription>
      </Alert>

      <Button onClick={onRetry} variant={"outline"}>
        Retry
      </Button>
    </div>
  );
}
