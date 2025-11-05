import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateAccountForm } from "@/features/user/components/accounts/create-account-form";
import { loadAccountPermissions } from "@/features/user/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

async function CreateAccountPage() {
  const permissions = await loadAccountPermissions();

  if (!permissions.canInsert) {
    notFound();
  }

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Accounts", url: "/home/user/accounts" }, { title: "Create" }]} />
      <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Account</CardTitle>
          <CardDescription>
            Create a new account with email or phone authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAccountForm />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default withI18n(CreateAccountPage);
