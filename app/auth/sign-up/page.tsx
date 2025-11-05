import Link from "next/link";

import authConfig from "@/config/auth.config";
import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignInLayout } from "@/features/auth/components/sign-in-layout";
import { SignUpMethodsContainer } from "@/features/auth/components/sign-up-methods-container";

export const generateMetadata = async () => {
  return {
    title: "Sign Up",
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  appHome: pathsConfig.app.home,
};

function SignUpPage() {
  return (
    <AuthLayout>
      <SignInLayout title="Get started" description="Create a new account">
        <SignUpMethodsContainer
          providers={authConfig.providers}
          displayTermsCheckbox={authConfig.displayTermsCheckbox}
          paths={paths}
        />
        <div className={"flex justify-center text-sm"}>
          <Link href={pathsConfig.auth.signIn} className="hover:underline">
            Already have an account?
          </Link>
        </div>
      </SignInLayout>
    </AuthLayout>
  );
}

export default SignUpPage;
