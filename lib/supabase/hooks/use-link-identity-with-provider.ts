import type { Provider } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

export function useLinkIdentityWithProvider(
  props: {
    redirectToPath?: string;
  } = {},
) {
  const client = useSupabase();
  const mutationKey = ['auth', 'link-identity'];

  const mutationFn = async (provider: Provider) => {
    const origin = window.location.origin;
    const redirectToPath = props.redirectToPath ?? '/home/settings';

    const url = new URL('/auth/callback', origin);
    url.searchParams.set('redirectTo', redirectToPath);

    const { error: linkError } = await client.auth.linkIdentity({
      provider,
      options: {
        redirectTo: url.toString(),
      },
    });

    if (linkError) {
      throw linkError.message ?? linkError;
    }

    await client.auth.refreshSession();
  };

  return useMutation({ mutationKey, mutationFn });
}