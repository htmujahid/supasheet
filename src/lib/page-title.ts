import { getContext } from "#/integrations/tanstack-query/root-provider"
import {
  DEFAULT_APP_CONFIG,
  appConfigQueryOptions,
} from "#/lib/supabase/data/config"

export function pageTitle(prefix?: string): string {
  const { queryClient } = getContext()
  const appConfig =
    queryClient.getQueryData(appConfigQueryOptions().queryKey) ??
    DEFAULT_APP_CONFIG
  return prefix ? `${prefix} | ${appConfig.name}` : appConfig.name
}
