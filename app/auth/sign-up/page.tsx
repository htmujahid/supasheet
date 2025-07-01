import Link from "next/link";

import { Trans } from "@/components/makerkit/trans";
import authConfig from "@/config/auth.config";
import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignInLayout } from "@/features/auth/components/sign-in-layout";
import { SignUpMethodsContainer } from "@/features/auth/components/sign-up-methods-container";
import { createI18nServerInstance } from "@/lib/i18n/i18n.server";
import { withI18n } from "@/lib/i18n/with-i18n";

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();

  return {
    title: i18n.t("auth:signUp"),
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  appHome: pathsConfig.app.home,
};

function SignUpPage() {
  return (
    <AuthLayout>
      <SignInLayout
        title={<Trans i18nKey={"auth:signUpHeading"} />}
        description={<Trans i18nKey={"auth:signUpDescription"} />}
      >
        <SignUpMethodsContainer
          providers={authConfig.providers}
          displayTermsCheckbox={authConfig.displayTermsCheckbox}
          paths={paths}
        />
        <div className={"flex justify-center text-sm"}>
          <Link href={pathsConfig.auth.signIn} className="hover:underline">
            <Trans i18nKey={"auth:alreadyHaveAnAccount"} />
          </Link>
        </div>
      </SignInLayout>
    </AuthLayout>
  );
}

export default withI18n(SignUpPage);
