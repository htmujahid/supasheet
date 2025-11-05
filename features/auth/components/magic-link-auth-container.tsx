"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { useSignInWithOtp } from "@/lib/supabase/hooks/use-sign-in-with-otp";

import { useCaptchaToken } from "../lib/hooks/use-captcha-token";
import { TermsAndConditionsFormField } from "./terms-and-conditions-form-field";

export function MagicLinkAuthContainer({
  redirectUrl,
  shouldCreateUser,
  defaultValues,
  displayTermsCheckbox,
}: {
  redirectUrl: string;
  shouldCreateUser: boolean;
  displayTermsCheckbox?: boolean;

  defaultValues?: {
    email: string;
  };
}) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();
  const signInWithOtpMutation = useSignInWithOtp();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      }),
    ),
    defaultValues: {
      email: defaultValues?.email ?? "",
    },
  });

  const onSubmit = ({ email }: { email: string }) => {
    const url = new URL(redirectUrl);
    const emailRedirectTo = url.href;

    const promise = async () => {
      await signInWithOtpMutation.mutateAsync({
        email,
        options: {
          emailRedirectTo,
          captchaToken,
          shouldCreateUser,
        },
      });
    };

    toast.promise(promise, {
      loading: "Sending Email Link...",
      success: "Email link sent successfully",
      error: "Failed to send email link",
    });

    resetCaptchaToken();
  };

  if (signInWithOtpMutation.data) {
    return <SuccessAlert />;
  }

  return (
    <Form {...form}>
      <form className={"w-full"} onSubmit={form.handleSubmit(onSubmit)}>
        <If condition={signInWithOtpMutation.error}>
          <ErrorAlert />
        </If>

        <div className={"flex flex-col space-y-4"}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>

                <FormControl>
                  <Input
                    data-test={"email-input"}
                    required
                    type="email"
                    placeholder={"your@email.com"}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            name={"email"}
          />

          <If condition={displayTermsCheckbox}>
            <TermsAndConditionsFormField />
          </If>

          <Button disabled={signInWithOtpMutation.isPending}>
            <If
              condition={signInWithOtpMutation.isPending}
              fallback={"Send Email Link"}
            >
              Sending Email Link...
            </If>
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SuccessAlert() {
  return (
    <Alert variant={"success"}>
      <CheckIcon className={"h-4"} />

      <AlertTitle>We sent you a link by email</AlertTitle>

      <AlertDescription>
        Check your email, we just sent you a link. Follow the link to sign in.
      </AlertDescription>
    </Alert>
  );
}

function ErrorAlert() {
  return (
    <Alert variant={"destructive"}>
      <AlertCircleIcon className={"h-4"} />

      <AlertTitle>
        Sorry, we weren&apos;t able to authenticate you. Please try again.
      </AlertTitle>

      <AlertDescription>
        Sorry, we encountered an error while sending your link. Please try
        again.
      </AlertDescription>
    </Alert>
  );
}
