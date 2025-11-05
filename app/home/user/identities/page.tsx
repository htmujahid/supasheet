import { Metadata } from "next";

import { DefaultHeader } from "@/components/layouts/default-header";
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

export const metadata: Metadata = {
  title: "Identities",
};

function IdentitiesPage() {
  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Identities" }]} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Update your Email</CardTitle>

            <CardDescription>
              Update your email address you use to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <UpdateEmailFormContainer
              callbackPath={pathsConfig.auth.callback}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked Accounts</CardTitle>

            <CardDescription>
              Connect other authentication providers
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

export default IdentitiesPage;
