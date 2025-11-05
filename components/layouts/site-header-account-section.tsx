"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import type { User } from "@supabase/supabase-js";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import featuresFlagConfig from "@/config/feature-flags.config";
import pathsConfig from "@/config/paths.config";
import { PersonalAccountDropdown } from "@/features/user/components/personal-account-dropdown";
import { useSignOut } from "@/lib/supabase/hooks/use-sign-out";
import { useUser } from "@/lib/supabase/hooks/use-user";

const ModeToggle = dynamic(() =>
  import("@/components/makerkit/mode-toggle").then((mod) => ({
    default: mod.ModeToggle,
  })),
);

const paths = {
  home: pathsConfig.app.home,
  account: pathsConfig.app.account,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function SiteHeaderAccountSection({
  user,
}: React.PropsWithChildren<{
  user: User | null;
}>) {
  if (!user) {
    return <AuthButtons />;
  }

  return <SuspendedPersonalAccountDropdown user={user} />;
}

function SuspendedPersonalAccountDropdown({
  user: userProp,
}: {
  user: User | null;
}) {
  const signOut = useSignOut();
  const user = useUser(userProp);
  const userData = user.data ?? userProp ?? null;

  if (userData) {
    return (
      <PersonalAccountDropdown
        paths={paths}
        features={features}
        user={userData}
        signOutRequested={() => signOut.mutateAsync()}
      />
    );
  }

  return <AuthButtons />;
}

function AuthButtons() {
  return (
    <div className={"flex space-x-2"}>
      <div className={"hidden space-x-0.5 md:flex"}>
        <If condition={features.enableThemeToggle}>
          <ModeToggle />
        </If>

        <Button asChild variant={"ghost"}>
          <Link href={pathsConfig.auth.signIn}>Sign In</Link>
        </Button>
      </div>

      <Button asChild className="group" variant={"default"}>
        <Link href={pathsConfig.auth.signUp}>Sign Up</Link>
      </Button>
    </div>
  );
}
