"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { If } from "@/components/makerkit/if";
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

import { PasswordSignUpSchema } from "../lib/schemas/password-sign-up.schema";
import { TermsAndConditionsFormField } from "./terms-and-conditions-form-field";

export function PasswordSignUpForm({
  defaultValues,
  displayTermsCheckbox,
  onSubmit,
  loading,
}: {
  defaultValues?: {
    email: string;
  };

  displayTermsCheckbox?: boolean;

  onSubmit: (params: { email: string; password: string }) => unknown;
  loading: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(PasswordSignUpSchema),
    defaultValues: {
      email: defaultValues?.email ?? "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className={"w-full space-y-4"}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={"email"}
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
        />

        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input
                  required
                  data-test={"password-input"}
                  type="password"
                  placeholder={""}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <If condition={displayTermsCheckbox}>
          <TermsAndConditionsFormField />
        </If>

        <Button
          data-test={"auth-submit-button"}
          className={"w-full"}
          type="submit"
          disabled={loading}
        >
          <If
            condition={loading}
            fallback={
              <>
                Sign up with Email
                <ArrowRight
                  className={
                    "zoom-in animate-in slide-in-from-left-2 fill-mode-both h-4 delay-500 duration-500"
                  }
                />
              </>
            }
          >
            Signing up...
          </If>
        </Button>
      </form>
    </Form>
  );
}
