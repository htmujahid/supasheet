"use client";

import { useCallback } from "react";

import type { Provider } from "@supabase/supabase-js";

import { If } from "@/components/makerkit/if";
import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import { useSignInWithProvider } from "@/lib/supabase/hooks/use-sign-in-with-provider";

import { AuthErrorAlert } from "./auth-error-alert";
import { AuthProviderButton } from "./auth-provider-button";

/**
 * @name OAUTH_SCOPES
 * @description
 * The OAuth scopes are used to specify the permissions that the application is requesting from the user.
 *
 * Please add your OAuth providers here and the scopes you want to use.
 *
 * @see https://supabase.com/docs/guides/auth/social-login
 */
const OAUTH_SCOPES: Partial<Record<Provider, string>> = {
  azure: "email",
  // add your OAuth providers here
};

export function OauthProviders({
  shouldCreateUser,
  enabledProviders,
  paths,
}: {
  shouldCreateUser: boolean;
  enabledProviders: Provider[];

  paths: {
    callback: string;
    returnPath: string;
  };
}) {
  const signInWithProviderMutation = useSignInWithProvider();

  // we make the UI "busy" until the next page is fully loaded
  const loading = signInWithProviderMutation.isPending;

  const onSignInWithProvider = useCallback(
    async (signInRequest: () => Promise<unknown>) => {
      const credential = await signInRequest();

      if (!credential) {
        return Promise.reject(new Error("Failed to sign in with provider"));
      }
    },
    [],
  );

  if (!enabledProviders?.length) {
    return null;
  }

  return (
    <>
      <If condition={loading}>
        <LoadingOverlay />
      </If>

      <div className={"flex w-full flex-1 flex-col space-y-3"}>
        <div className={"flex-col space-y-2"}>
          {enabledProviders.map((provider) => {
            return (
              <AuthProviderButton
                key={provider}
                providerId={provider}
                onClick={() => {
                  const origin = window.location.origin;
                  const queryParams = new URLSearchParams();

                  if (paths.returnPath) {
                    queryParams.set("next", paths.returnPath);
                  }

                  const redirectPath = [
                    paths.callback,
                    queryParams.toString(),
                  ].join("?");

                  const redirectTo = [origin, redirectPath].join("");
                  const scopesOpts = OAUTH_SCOPES[provider] ?? {};

                  const credentials = {
                    provider,
                    options: {
                      shouldCreateUser,
                      redirectTo,
                      ...scopesOpts,
                    },
                  };

                  return onSignInWithProvider(() =>
                    signInWithProviderMutation.mutateAsync(credentials),
                  );
                }}
              >
                Sign in with {getProviderName(provider)}
              </AuthProviderButton>
            );
          })}
        </div>

        <AuthErrorAlert error={signInWithProviderMutation.error} />
      </div>
    </>
  );
}

function getProviderName(providerId: string) {
  const capitalize = (value: string) =>
    value.slice(0, 1).toUpperCase() + value.slice(1);

  if (providerId.endsWith(".com")) {
    return capitalize(providerId.split(".com")[0]!);
  }

  return capitalize(providerId);
}
