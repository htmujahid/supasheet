import Link from "next/link";

import { Trans } from "@/components/makerkit/trans";
import authConfig from "@/config/auth.config";
import pathsConfig from "@/config/paths.config";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignInLayout } from "@/features/auth/components/sign-in-layout";
import { SignInMethodsContainer } from "@/features/auth/components/sign-in-methods-container";
import { createI18nServerInstance } from "@/lib/i18n/i18n.server";
import { withI18n } from "@/lib/i18n/with-i18n";

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();

  return {
    title: i18n.t("auth:signIn"),
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  home: pathsConfig.app.home,
};

function SignInPage() {
  return (
    <AuthLayout>
      <SignInLayout
        title={<Trans i18nKey={"auth:signInHeading"} />}
        description={<Trans i18nKey={"auth:signInDescription"} />}
      >
        <SignInMethodsContainer
          paths={paths}
          providers={authConfig.providers}
        />
        <div className={"flex justify-center text-sm"}>
          <Link href={pathsConfig.auth.signUp} className="hover:underline">
            <Trans i18nKey={"auth:doNotHaveAccountYet"} />
          </Link>
        </div>
      </SignInLayout>
    </AuthLayout>
  );
}

export default withI18n(SignInPage);
