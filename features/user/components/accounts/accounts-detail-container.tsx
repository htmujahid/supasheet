"use client";

import { loadUser } from "../../lib/loaders";
import { AccountsDetailView } from "./accounts-detail-view";

type AccountsDetailContainerProps = {
  user: Awaited<ReturnType<typeof loadUser>>;
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
