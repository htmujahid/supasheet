"use client";

import { loadSingleUser } from "../../lib/loaders";
import { AccountsDetailView } from "./accounts-detail-view";

type AccountsDetailContainerProps = {
  user: Awaited<ReturnType<typeof loadSingleUser>>;
  permissions: {
    canUpdate: boolean;
    canDelete: boolean;
  };
  currentUserId: string | null;
};

export function AccountsDetailContainer({
  user,
  permissions,
  currentUserId,
}: AccountsDetailContainerProps) {
  return (
    <AccountsDetailView
      user={user!}
      permissions={permissions}
      currentUserId={currentUserId}
    />
  );
}
