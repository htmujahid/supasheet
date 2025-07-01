import { ProfileContainer } from "@/features/accounts/components/profile-container";
import { requireUserInServerComponent } from "@/lib/server/require-user-in-server-component";

export default async function IdentitiesPage() {
  const user = await requireUserInServerComponent();

  return <ProfileContainer userId={user.id} />;
}
