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
import { CreateAccountForm } from "@/features/user/components/accounts/create-account-form";
import { loadAccountPermissions, loadCurrentUserRoles } from "@/features/user/lib/loaders";

export const metadata: Metadata = {
  title: "Create Account",
};

async function AccountCreatePage() {
  const permissions = await loadAccountPermissions();
  const userRoles = await loadCurrentUserRoles();

  if (!permissions.canInsert) {
    notFound();
  }

  return (
    <div>
      <DefaultHeader
        breadcrumbs={[
          { title: "Accounts", url: "/home/user/accounts" },
          { title: "Create" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Account</CardTitle>
            <CardDescription>
              Create a new account with email or phone authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateAccountForm userRoles={userRoles} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AccountCreatePage;
