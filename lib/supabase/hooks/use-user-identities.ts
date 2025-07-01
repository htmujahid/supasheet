import { useMemo } from "react";

import type { Provider } from "@supabase/supabase-js";

import { useQuery } from "@tanstack/react-query";

import { useSupabase } from "./use-supabase";

export const USER_IDENTITIES_QUERY_KEY = ["user-identities"];

export function useUserIdentities() {
  const supabase = useSupabase();

  const {
    data: identities = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: USER_IDENTITIES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUserIdentities();

      if (error) {
        throw error;
      }

      return data.identities;
    },
  });

  const connectedProviders = useMemo(() => {
    return identities.map((identity) => identity.provider);
  }, [identities]);

  const hasMultipleIdentities = identities.length > 1;

  const getIdentityByProvider = (provider: Provider) => {
    return identities.find((identity) => identity.provider === provider);
  };

  const isProviderConnected = (provider: Provider) => {
    return connectedProviders.includes(provider);
  };

  return {
    identities,
    connectedProviders,
    hasMultipleIdentities,
    getIdentityByProvider,
    isProviderConnected,
    isLoading,
    error,
    refetch,
  };
}
