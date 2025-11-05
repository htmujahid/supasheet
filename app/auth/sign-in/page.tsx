import Link from "next/link";

import authConfig from "@/config/auth.config";
import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignInLayout } from "@/features/auth/components/sign-in-layout";
import { SignInMethodsContainer } from "@/features/auth/components/sign-in-methods-container";

export const generateMetadata = async () => {
  return {
    title: "Sign In",
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  home: pathsConfig.app.home,
};

function SignInPage() {
  return (
    <AuthLayout>
      <SignInLayout title="Welcome Back" description="Sign in to your account">
        <SignInMethodsContainer
          paths={paths}
          providers={authConfig.providers}
        />
        <div className={"flex justify-center text-sm"}>
          <Link href={pathsConfig.auth.signUp} className="hover:underline">
            Do not have an account yet?
          </Link>
        </div>
      </SignInLayout>
    </AuthLayout>
  );
}

export default SignInPage;
