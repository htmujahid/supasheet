import type { User } from "@supabase/supabase-js";

import { AppLogo } from "@/components/app-logo";
import { SiteNavigation } from "@/components/layouts/site-navigation";
import { Header } from "@/components/makerkit/header";

import { SiteHeaderAccountSection } from "./site-header-account-section";

export function SiteHeader(props: { user?: User | null }) {
  return (
    <Header
      logo={<AppLogo />}
      navigation={<SiteNavigation />}
      actions={<SiteHeaderAccountSection user={props.user ?? null} />}
    />
  );
}
