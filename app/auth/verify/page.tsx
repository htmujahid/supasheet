import { redirect } from "next/navigation";

import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { MultiFactorChallengeContainer } from "@/features/auth/components/multi-factor-challenge-container";
import { createI18nServerInstance } from "@/lib/i18n/i18n.server";
import { withI18n } from "@/lib/i18n/with-i18n";
import { checkRequiresMultiFactorAuthentication } from "@/lib/supabase/check-requires-mfa";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

interface Props {
  searchParams: Promise<{
    next?: string;
  }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();

  return {
    title: i18n.t("auth:signIn"),
  };
};

async function VerifyPage(props: Props) {
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

  const nextPath = (await props.searchParams).next;
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

export default withI18n(VerifyPage);
