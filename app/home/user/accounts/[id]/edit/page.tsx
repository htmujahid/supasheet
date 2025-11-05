import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateAccountForm } from "@/features/user/components/accounts/update-account-form";
import {
  loadAccountPermissions,
  loadSingleUser,
} from "@/features/user/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

type UpdateAccountPageProps = {
  params: Promise<{ id: string }>;
};

async function UpdateAccountPage(props: UpdateAccountPageProps) {
  const { id } = await props.params;

  const [permissions, account] = await Promise.all([
    loadAccountPermissions(),
    loadSingleUser(id),
  ]);

  if (!permissions.canUpdate) {
    notFound();
  }

  if (!account) {
    notFound();
  }

  return (
    <div>
      <DefaultHeader
        breadcrumbs={[
          { title: "Accounts", url: "/home/user/accounts" },
          {
            title: account.email || account.phone || account.id,
            url: `/home/user/accounts/${id}`,
          },
          { title: "Edit" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Update Account</CardTitle>
            <CardDescription>
              Update account authentication details for{" "}
              {account.email || account.phone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateAccountForm account={account} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withI18n(UpdateAccountPage);
