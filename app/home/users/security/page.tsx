import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import pathsConfig from "@/config/paths.config";
import { MultiFactorAuthFactorsList } from "@/features/users/components/mfa/multi-factor-auth-list";
import { UpdatePasswordFormContainer } from "@/features/users/components/password/update-password-container";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { requireUser } from "@/lib/supabase/require-user";

export default async function SecurityPage() {
  const client = await getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  return (
    <div className="flex flex-col gap-4">
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
  );
}
