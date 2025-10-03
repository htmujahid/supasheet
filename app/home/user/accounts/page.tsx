import { ProfileContainer } from "@/features/users/components/profile-container";
import { withI18n } from "@/lib/i18n/with-i18n";
import { requireUserInServerComponent } from "@/lib/server/require-user-in-server-component";

async function AccountsPage() {
  const user = await requireUserInServerComponent();

  return <ProfileContainer userId={user.id} />;
}

export default withI18n(AccountsPage);
