import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

interface Credentials {
  email: string;
  password: string;
  emailRedirectTo: string;
  captchaToken?: string;
}

/**
 * @name useSignUpWithEmailAndPassword
 * @description Use Supabase to sign up a user with email and password in a React component
 */
export function useSignUpWithEmailAndPassword() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-up-with-email-password'];

  const mutationFn = async (params: Credentials) => {
    const { emailRedirectTo, captchaToken, ...credentials } = params;

    const response = await client.auth.signUp({
      ...credentials,
      options: {
        emailRedirectTo,
        captchaToken,
      },
    });

    if (response.error) {
      throw response.error.message;
    }

    const user = response.data?.user;
    const identities = user?.identities ?? [];

    // if the user has no identities, it means that the email is taken
    if (identities.length === 0) {
      throw new Error('User already registered');
    }

    return response.data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}
