import { Metadata } from "next";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ProfileContainer } from "@/features/user/components/profile-container";
import { requireUserInServerComponent } from "@/lib/server/require-user-in-server-component";

export const metadata: Metadata = {
  title: "Profile",
};

async function ProfilePage() {
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

export default ProfilePage;
