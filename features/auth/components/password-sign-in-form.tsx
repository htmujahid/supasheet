"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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

import { PasswordSignInSchema } from "../lib/schemas/password-sign-in.schema";

export function PasswordSignInForm({
  onSubmit,
  loading,
}: {
  onSubmit: (params: z.infer<typeof PasswordSignInSchema>) => unknown;
  loading: boolean;
}) {
  const form = useForm<z.infer<typeof PasswordSignInSchema>>({
    resolver: zodResolver(PasswordSignInSchema),
    defaultValues: {
      email: "user@supasheet.dev",
      password: "12345678",
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
                  placeholder="your@email.com"
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
              <div className="flex justify-between">
                <FormLabel>Password</FormLabel>

                <Link
                  href={"/auth/password-reset"}
                  className="text-sm hover:underline"
                >
                  Password forgotten?
                </Link>
              </div>

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

        <Button
          data-test="auth-submit-button"
          className={"group w-full"}
          type="submit"
          disabled={loading}
        >
          <If
            condition={loading}
            fallback={
              <>
                Sign in with Email
                <ArrowRight
                  className={
                    "zoom-in animate-in slide-in-from-left-2 fill-mode-both h-4 delay-500 duration-500"
                  }
                />
              </>
            }
          >
            Signing in...
          </If>
        </Button>
      </form>
    </Form>
  );
}
