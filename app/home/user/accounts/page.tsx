import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { AccountsTable } from "@/features/user/components/accounts/accounts-table";
import {
  loadAccountPermissions,
  loadAccounts,
} from "@/features/user/lib/loaders";
import { usersSearchParamsCache } from "@/features/user/lib/validations";
import { withI18n } from "@/lib/i18n/with-i18n";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function UsersPage(props: {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>
}) {
  const permissions = await loadAccountPermissions();

  if (!permissions.canSelect) {
    notFound();
  }

  const searchParams = await props.searchParams;
  const params = usersSearchParamsCache.parse(searchParams);

  const data = await loadAccounts(params);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Accounts" }]}>
        <Button variant={"outline"} asChild>
          <Link href={"/home/user/accounts/create"}>
            Create Account
          </Link>
        </Button>
      </DefaultHeader>
      <div className="flex flex-col gap-4 px-4">
        <AccountsTable data={data} />
      </div>
    </div>
  );
}

export default withI18n(UsersPage);