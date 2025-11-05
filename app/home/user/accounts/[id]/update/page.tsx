import { Metadata } from "next";

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

type AccountUpdatePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AccountUpdatePageProps): Promise<Metadata> {
  const { id } = await params;
  const account = await loadSingleUser(id);

  return {
    title: `Update ${account?.email || account?.phone || id}`,
  };
}

async function AccountUpdatePage({ params }: AccountUpdatePageProps) {
  const { id } = await params;

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

export default AccountUpdatePage;
