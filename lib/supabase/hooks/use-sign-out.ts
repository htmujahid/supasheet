import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

/**
 * @name useSignOut
 * @description Use Supabase to sign out a user in a React component
 */
export function useSignOut() {
  const client = useSupabase();

  return useMutation({
    mutationFn: () => {
      return client.auth.signOut();
    },
  });
}
