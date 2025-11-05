import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { AccountsDetailContainer } from "@/features/user/components/accounts/accounts-detail-container";
import {
  loadAccountPermissions,
  loadSingleUser,
} from "@/features/user/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { requireUser } from "@/lib/supabase/require-user";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function UserDetailPage(props: UserDetailPageProps) {
  const { id } = await props.params;
  const permissions = await loadAccountPermissions();

  if (!permissions.canSelect) {
    notFound();
  }

  const user = await loadSingleUser(id);

  if (!user) {
    notFound();
  }

  // Get current authenticated user
  const client = await getSupabaseServerClient();
  const currentUserResult = await requireUser(client);
  const currentUserId = currentUserResult.error
    ? null
    : currentUserResult.data.id;

  return (
    <div>
      <DefaultHeader
        breadcrumbs={[
          { title: "Accounts", url: "/home/user/accounts" },
          { title: user.email || user.id },
        ]}
      />
      <div className="mx-auto max-w-3xl p-4">
        <AccountsDetailContainer
          user={user}
          permissions={{
            canUpdate: permissions.canUpdate,
            canDelete: permissions.canDelete,
          }}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}

export default withI18n(UserDetailPage);
