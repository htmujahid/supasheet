import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import authConfig from "@/config/auth.config";
import pathsConfig from "@/config/paths.config";
import { UpdateEmailFormContainer } from "@/features/users/components/email/update-email-form-container";
import { LinkAccountsList } from "@/features/users/components/link-accounts";

export default function IdentitiesPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={"account:updateEmailCardTitle"} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={"account:updateEmailCardDescription"} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateEmailFormContainer callbackPath={pathsConfig.auth.callback} />
        </CardContent>
      </Card>

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
    </div>
  );
}
