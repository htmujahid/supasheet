import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import authConfig from "@/config/auth.config";
import { LinkAccountsList } from "@/features/accounts/components/link-accounts";

export default function IdentitiesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans i18nKey={"account:linkedAccounts"} />
        </CardTitle>

        <CardDescription>
          <Trans i18nKey={"account:linkedAccountsDescription"} />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LinkAccountsList providers={authConfig.providers.oAuth} />
      </CardContent>
    </Card>
  );
}
