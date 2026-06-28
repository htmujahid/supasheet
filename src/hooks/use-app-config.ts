import { getRouteApi } from "@tanstack/react-router"

import { DEFAULT_APP_CONFIG } from "#/lib/supabase/data/config"
import type { AppConfig } from "#/lib/supabase/data/config"

export function useAppConfig(): AppConfig {
  const context = getRouteApi("__root__").useRouteContext()
  return context.appConfig ?? DEFAULT_APP_CONFIG
}
