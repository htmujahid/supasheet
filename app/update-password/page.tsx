import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { PasswordResetLayout } from "@/features/auth/components/password-reset-layout";
import { UpdatePasswordForm } from "@/features/auth/components/update-password-form";
import { requireUserInServerComponent } from "@/lib/server/require-user-in-server-component";

export const generateMetadata = async () => {
  return {
    title: "Update Password",
  };
};

type UpdatePasswordPageProps = {
  searchParams: Promise<{
    callback?: string;
  }>;
};

async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  await requireUserInServerComponent();

  const { callback } = await searchParams;
  const redirectTo = callback ?? pathsConfig.app.home;

  return (
    <AuthLayout isCoverImage={false}>
      <PasswordResetLayout
        title="Reset Password"
        description="Enter your new password below."
      >
        <UpdatePasswordForm redirectTo={redirectTo} />
      </PasswordResetLayout>
    </AuthLayout>
  );
}

export default UpdatePasswordPage;
