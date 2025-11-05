import { redirect } from "next/navigation";

import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { MultiFactorChallengeContainer } from "@/features/auth/components/multi-factor-challenge-container";
import { checkRequiresMultiFactorAuthentication } from "@/lib/supabase/check-requires-mfa";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

type VerifyPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const generateMetadata = async () => {
  return {
    title: "Sign In",
  };
};

async function VerifyPage({ searchParams }: VerifyPageProps) {
  const client = await getSupabaseServerClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    redirect(pathsConfig.auth.signIn);
  }

  const needsMfa = await checkRequiresMultiFactorAuthentication(client);

  if (!needsMfa) {
    redirect(pathsConfig.auth.signIn);
  }

  const nextPath = (await searchParams).next;
  const redirectPath = nextPath ?? pathsConfig.app.home;

  return (
    <AuthLayout>
      <MultiFactorChallengeContainer
        userId={user.id}
        paths={{
          redirectPath,
        }}
      />
    </AuthLayout>
  );
}

export default VerifyPage;
