import { ProfileContainer } from "@/features/users/components/profile-container";
import { requireUserInServerComponent } from "@/lib/server/require-user-in-server-component";

export default async function AccountsPage() {
  const user = await requireUserInServerComponent();

  return <ProfileContainer userId={user.id} />;
}
