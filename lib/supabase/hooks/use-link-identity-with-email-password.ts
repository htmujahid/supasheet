import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSupabase } from "./use-supabase";
import { USER_IDENTITIES_QUERY_KEY } from "./use-user-identities";

type Credentials = {
  email: string;
  password: string;
  redirectTo: string;
};

export function useLinkIdentityWithEmailPassword() {
  const client = useSupabase();
  const queryClient = useQueryClient();
  const mutationKey = ["auth", "link-email-password"];

  const mutationFn = async (credentials: Credentials) => {
    const { email, password, redirectTo } = credentials;

    const { error } = await client.auth.updateUser(
      {
        email,
        password,
        data: {
          // This is used to indicate that the user has a password set
          // because Supabase does not add the identity after setting a password
          // if the user was created with oAuth
          hasPassword: true,
        },
      },
      { emailRedirectTo: redirectTo },
    );

    if (error) {
      throw error.message ?? error;
    }

    await client.auth.refreshSession();
  };

  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: USER_IDENTITIES_QUERY_KEY,
      });
    },
  });
}
