import type { UserIdentity } from '@supabase/supabase-js';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { USER_IDENTITIES_QUERY_KEY } from './use-user-identities';

export function useUnlinkUserIdentity() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identity: UserIdentity) => {
      // Unlink the identity
      const { error } = await supabase.auth.unlinkIdentity(identity);

      if (error) {
        throw error;
      }

      return identity;
    },
    onSuccess: () => {
      // Invalidate and refetch user identities
      return queryClient.invalidateQueries({
        queryKey: USER_IDENTITIES_QUERY_KEY,
      });
    },
  });
}