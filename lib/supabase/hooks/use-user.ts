import type { User } from '@supabase/supabase-js';

import { useQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

const queryKey = ['supabase:user'];

/**
 * @name useUser
 * @description Use Supabase to get the current user in a React component
 * @param initialData
 */
export function useUser(initialData?: User | null) {
  const client = useSupabase();

  const queryFn = async () => {
    const response = await client.auth.getUser();

    // this is most likely a session error or the user is not logged in
    if (response.error) {
      return undefined;
    }

    if (response.data?.user) {
      return response.data.user;
    }

    return Promise.reject(new Error('Unexpected result format'));
  };

  return useQuery({
    queryFn,
    queryKey,
    initialData,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
