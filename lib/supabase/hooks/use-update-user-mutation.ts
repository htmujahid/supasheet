import type { UserAttributes } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

type Params = UserAttributes & { redirectTo: string };

/**
 * @name useUpdateUser
 * @description Use Supabase to update the current user in a React component
 */
export function useUpdateUser() {
  const client = useSupabase();
  const mutationKey = ['supabase:user'];

  const mutationFn = async (attributes: Params) => {
    const { redirectTo, ...params } = attributes;

    const response = await client.auth.updateUser(params, {
      emailRedirectTo: redirectTo,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}
