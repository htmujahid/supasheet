"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { If } from "@/components/makerkit/if";
import { Trans } from "@/components/makerkit/trans";
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

import { useCaptchaToken } from "../captcha/client";
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
  const { t } = useTranslation();
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
      loading: t("auth:sendingEmailLink"),
      success: t(`auth:sendLinkSuccessToast`),
      error: t(`auth:errors.link`),
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
                <FormLabel>
                  <Trans i18nKey={"common:emailAddress"} />
                </FormLabel>

                <FormControl>
                  <Input
                    data-test={"email-input"}
                    required
                    type="email"
                    placeholder={t("auth:emailPlaceholder")}
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
              fallback={<Trans i18nKey={"auth:sendEmailLink"} />}
            >
              <Trans i18nKey={"auth:sendingEmailLink"} />
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

      <AlertTitle>
        <Trans i18nKey={"auth:sendLinkSuccess"} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={"auth:sendLinkSuccessDescription"} />
      </AlertDescription>
    </Alert>
  );
}

function ErrorAlert() {
  return (
    <Alert variant={"destructive"}>
      <AlertCircleIcon className={"h-4"} />

      <AlertTitle>
        <Trans i18nKey={"auth:errors.generic"} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={"auth:errors.link"} />
      </AlertDescription>
    </Alert>
  );
}
