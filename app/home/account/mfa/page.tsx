import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiFactorAuthFactorsList } from "@/features/accounts/components/mfa/multi-factor-auth-list";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { requireUser } from "@/lib/supabase/require-user";

export default async function MFAPage() {
  const client = await getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  return (
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
  );
}
