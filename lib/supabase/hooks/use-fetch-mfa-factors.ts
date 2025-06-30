import { useQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

/**
 * @name useFetchAuthFactors
 * @description Use Supabase to fetch the MFA factors for a user in a React component
 * @param userId
 */
export function useFetchAuthFactors(userId: string) {
  const client = useSupabase();
  const queryKey = useFactorsMutationKey(userId);

  const queryFn = async () => {
    const { data, error } = await client.auth.mfa.listFactors();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 0,
  });
}
