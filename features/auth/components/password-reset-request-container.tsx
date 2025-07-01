"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { If } from "@/components/makerkit/if";
import { Trans } from "@/components/makerkit/trans";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useRequestResetPassword } from "@/lib/supabase/hooks/use-request-reset-password";

import { useCaptchaToken } from "../captcha/client";
import { AuthErrorAlert } from "./auth-error-alert";

const PasswordResetSchema = z.object({
  email: z.string().email(),
});

export function PasswordResetRequestContainer(params: {
  redirectPath: string;
}) {
  const { t } = useTranslation("auth");
  const resetPasswordMutation = useRequestResetPassword();
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();

  const error = resetPasswordMutation.error;
  const success = resetPasswordMutation.data;

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <>
      <If condition={success}>
        <Alert variant={"success"}>
          <AlertDescription>
            <Trans i18nKey={"auth:passwordResetSuccessMessage"} />
          </AlertDescription>
        </Alert>
      </If>

      <If condition={!resetPasswordMutation.data}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ email }) => {
              const redirectTo = new URL(
                params.redirectPath,
                window.location.origin,
              ).href;

              return resetPasswordMutation
                .mutateAsync({
                  email,
                  redirectTo,
                  captchaToken,
                })
                .catch(() => {
                  resetCaptchaToken();
                });
            })}
            className={"w-full"}
          >
            <div className={"flex flex-col space-y-4"}>
              <AuthErrorAlert error={error} />

              <FormField
                name={"email"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey={"common:emailAddress"} />
                    </FormLabel>

                    <FormControl>
                      <Input
                        required
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={resetPasswordMutation.isPending} type="submit">
                <Trans i18nKey={"auth:passwordResetLabel"} />
              </Button>
            </div>
          </form>
        </Form>
      </If>
    </>
  );
}
