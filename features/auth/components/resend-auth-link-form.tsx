"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

import { useCaptchaToken } from "../lib/hooks/use-captcha-token";

export function ResendAuthLinkForm({
  redirectPath,
}: {
  redirectPath?: string;
}) {
  const resendLink = useResendLink();

  const form = useForm({
    resolver: zodResolver(z.object({ email: z.string().email() })),
    defaultValues: {
      email: "",
    },
  });

  if (resendLink.data && !resendLink.isPending) {
    return (
      <Alert variant={"success"}>
        <AlertTitle>Check your email!</AlertTitle>

        <AlertDescription>
          We sent you a new link to your email! Follow the link to sign in.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form
        className={"flex flex-col space-y-2"}
        onSubmit={form.handleSubmit((data) => {
          return resendLink.mutate({
            email: data.email,
            redirectPath,
          });
        })}
      >
        <FormField
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email Address</FormLabel>

                <FormControl>
                  <Input type="email" required {...field} />
                </FormControl>
              </FormItem>
            );
          }}
          name={"email"}
        />

        <Button disabled={resendLink.isPending}>Resend Link</Button>
      </form>
    </Form>
  );
}

function useResendLink() {
  const supabase = useSupabase();
  const { captchaToken } = useCaptchaToken();

  const mutationFn = async (props: {
    email: string;
    redirectPath?: string;
  }) => {
    const response = await supabase.auth.resend({
      email: props.email,
      type: "signup",
      options: {
        emailRedirectTo: props.redirectPath,
        captchaToken,
      },
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationFn,
  });
}
