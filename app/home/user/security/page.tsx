import { Metadata } from "next";

import { DefaultHeader } from "@/components/layouts/default-header";
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
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { requireUser } from "@/lib/supabase/require-user";

export const metadata: Metadata = {
  title: "Security",
};

async function SecurityPage() {
  const client = await getSupabaseServerClient();
  const { data: user } = await requireUser(client);

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Security" }]} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Update your Password</CardTitle>

            <CardDescription>
              Update your password to keep your account secure.
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
            <CardTitle>Multi-Factor Authentication</CardTitle>

            <CardDescription>
              Set up Multi-Factor Authentication method to further secure your
              account
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

export default SecurityPage;
