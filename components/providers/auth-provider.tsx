"use client";

import pathsConfig from "@/config/paths.config";
import { useAuthChangeListener } from "@/lib/supabase/hooks/use-auth-change-listener";

export function AuthProvider(props: React.PropsWithChildren) {
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
  });

  return props.children;
}
