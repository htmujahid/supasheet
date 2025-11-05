import { Metadata } from "next";

import Link from "next/link";

import type { AuthError } from "@supabase/supabase-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import pathsConfig from "@/config/paths.config";
import { ResendAuthLinkForm } from "@/features/auth/components/resend-auth-link-form";

export const metadata: Metadata = {
  title: "Authentication Error",
};

type AuthCallbackErrorPageProps = {
  searchParams: Promise<{
    error: string;
    callback?: string;
    email?: string;
    code?: AuthError["code"];
  }>;
};

async function AuthCallbackErrorPage({
  searchParams,
}: AuthCallbackErrorPageProps) {
  const { error, callback, code } = await searchParams;
  const signInPath = pathsConfig.auth.signIn;
  const redirectPath = callback ?? pathsConfig.auth.callback;

  return (
    <div className={"flex flex-col space-y-4 py-4"}>
      <Alert variant={"warning"}>
        <AlertTitle>Authentication Error</AlertTitle>

        <AlertDescription>
          {error ?? "Sorry, we could not authenticate you. Please try again."}
        </AlertDescription>
      </Alert>

      <AuthCallbackForm
        code={code}
        signInPath={signInPath}
        redirectPath={redirectPath}
      />
    </div>
  );
}

function AuthCallbackForm({
  signInPath,
  redirectPath,
  code,
}: {
  signInPath: string;
  redirectPath?: string;
  code?: AuthError["code"];
}) {
  switch (code) {
    case "otp_expired":
      return <ResendAuthLinkForm redirectPath={redirectPath} />;
    default:
      return <SignInButton signInPath={signInPath} />;
  }
}

function SignInButton({ signInPath }: { signInPath: string }) {
  return (
    <Button className={"w-full"} asChild>
      <Link href={signInPath}>Sign In</Link>
    </Button>
  );
}

export default AuthCallbackErrorPage;
