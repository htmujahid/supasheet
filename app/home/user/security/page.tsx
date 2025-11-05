import { DefaultHeader } from "@/components/layouts/default-header";
import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import pathsConfig from "@/config/paths.config";
import { MultiFactorAuthFactorsList } from "@/features/user/components/mfa/multi-factor-auth-list";
import { UpdatePasswordFormContainer } from "@/features/user/components/password/update-password-container";
import { withI18n } from "@/lib/i18n/with-i18n";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { requireUser } from "@/lib/supabase/require-user";

async function SecurityPage() {
  const client = await getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Security" }]} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey={"account:updatePasswordCardTitle"} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={"account:updatePasswordCardDescription"} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <UpdatePasswordFormContainer
              callbackPath={pathsConfig.auth.callback}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey={"account:multiFactorAuth"} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={"account:multiFactorAuthDescription"} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <MultiFactorAuthFactorsList userId={user?.id ?? ""} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withI18n(SecurityPage);
