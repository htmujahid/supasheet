import { DefaultHeader } from "@/components/layouts/default-header";
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
import { UpdateEmailFormContainer } from "@/features/user/components/email/update-email-form-container";
import { LinkAccountsList } from "@/features/user/components/link-accounts";
import { withI18n } from "@/lib/i18n/with-i18n";

function IdentitiesPage() {
  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Identities" }]} />
      <div className="flex flex-col gap-4 mx-auto max-w-3xl px-4">
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
    </div>
  );
}

export default withI18n(IdentitiesPage);
