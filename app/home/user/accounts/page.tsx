import { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { SearchParams } from "nuqs";

import { DefaultHeader } from "@/components/layouts/default-header";
import { Button } from "@/components/ui/button";
import { AccountsTable } from "@/features/user/components/accounts/accounts-table";
import {
  loadAccountPermissions,
  loadAccounts,
} from "@/features/user/lib/loaders";
import { usersSearchParamsCache } from "@/features/user/lib/validations";

export const metadata: Metadata = {
  title: "Accounts",
};

type AccountsPageProps = {
  searchParams: Promise<SearchParams>;
};

async function AccountsPage({ searchParams }: AccountsPageProps) {
  const permissions = await loadAccountPermissions();

  if (!permissions.canSelect) {
    notFound();
  }

  const params = usersSearchParamsCache.parse(await searchParams);

  const data = await loadAccounts(params);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Accounts" }]}>
        <Button variant={"outline"} asChild>
          <Link href={"/home/user/accounts/create"}>Create Account</Link>
        </Button>
      </DefaultHeader>
      <div className="flex flex-col gap-4 px-4">
        <AccountsTable data={data} />
      </div>
    </div>
  );
}

export default AccountsPage;
