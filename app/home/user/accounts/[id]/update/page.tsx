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
  loadUser,
  loadCurrentUserRoles,
  loadUserWithRoles,
} from "@/features/user/lib/loaders";

type AccountUpdatePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AccountUpdatePageProps): Promise<Metadata> {
  const { id } = await params;
  const account = await loadUser(id);

  return {
    title: `Update ${account?.email || account?.phone || id}`,
  };
}

async function AccountUpdatePage({ params }: AccountUpdatePageProps) {
  const { id } = await params;

  const [permissions, userRoles, user] = await Promise.all([
    loadAccountPermissions(),
    loadCurrentUserRoles(),
    loadUserWithRoles(id),
  ]);

  if (!permissions.canUpdate) {
    notFound();
  }

  if (!user) {
    notFound();
  }

  return (
    <div>
      <DefaultHeader
        breadcrumbs={[
          { title: "Accounts", url: "/home/user/accounts" },
          {
            title: user.email || user.phone || user.id,
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
              {user.email || user.phone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateAccountForm user={user} userRoles={userRoles} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AccountUpdatePage;
