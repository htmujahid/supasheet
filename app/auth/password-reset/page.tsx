import Link from "next/link";

import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { PasswordResetLayout } from "@/features/auth/components/password-reset-layout";
import { PasswordResetRequestContainer } from "@/features/auth/components/password-reset-request-container";

export const generateMetadata = async () => {
  return {
    title: "Reset Password",
  };
};

const { callback, passwordUpdate, signIn } = pathsConfig.auth;
const redirectPath = `${callback}?next=${passwordUpdate}`;

function PasswordResetPage() {
  return (
    <AuthLayout isCoverImage={false}>
      <PasswordResetLayout
        title="Reset Password"
        description="Enter your email address below. You will receive a link to reset your password."
      >
        <PasswordResetRequestContainer redirectPath={redirectPath} />

        <div className={"flex justify-center text-sm"}>
          <Link href={signIn} className="hover:underline">
            Password recovered?
          </Link>
        </div>
      </PasswordResetLayout>
    </AuthLayout>
  );
}

export default PasswordResetPage;
