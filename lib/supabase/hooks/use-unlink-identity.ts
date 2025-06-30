import type { UserIdentity } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

export function useUnlinkIdentity() {
  const client = useSupabase();
  const mutationKey = ['auth', 'unlink-identity'];

  const mutationFn = async (identity: UserIdentity) => {
    const { error } = await client.auth.unlinkIdentity(identity);

    if (error) {
      throw error.message ?? error;
    }

    await client.auth.refreshSession();
  };

  return useMutation({ mutationKey, mutationFn });
}