import { DefaultHeader } from "@/components/layouts/default-header";
import { ProfileContainer } from "@/features/user/components/profile-container";
import { withI18n } from "@/lib/i18n/with-i18n";
import { requireUserInServerComponent } from "@/lib/server/require-user-in-server-component";

async function AccountsPage() {
  const user = await requireUserInServerComponent();

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Profile" }]} />
      <div className="">
        <ProfileContainer userId={user.id} />
      </div>
    </div>
  );
}

export default withI18n(AccountsPage);
