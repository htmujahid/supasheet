'use client';

import type { Provider } from '@supabase/supabase-js';

import { If } from '@/components/makerkit/if';
import { isBrowser } from '@/lib/utils';

import { MagicLinkAuthContainer } from './magic-link-auth-container';
import { OauthProviders } from './oauth-providers';
import { EmailPasswordSignUpContainer } from './password-sign-up-container';

export function SignUpMethodsContainer(props: {
  paths: {
    callback: string;
    appHome: string;
  };

  providers: {
    password: boolean;
    magicLink: boolean;
    oAuth: Provider[];
  };

  displayTermsCheckbox?: boolean;
}) {
  const redirectUrl = getCallbackUrl(props);
  const defaultValues = getDefaultValues();

  return (
    <>
      <If condition={props.providers.password}>
        <EmailPasswordSignUpContainer
          emailRedirectTo={redirectUrl}
          defaultValues={defaultValues}
          displayTermsCheckbox={props.displayTermsCheckbox}
        />
      </If>

      <If condition={props.providers.magicLink}>
        <MagicLinkAuthContainer
          redirectUrl={redirectUrl}
          shouldCreateUser={true}
          defaultValues={defaultValues}
          displayTermsCheckbox={props.displayTermsCheckbox}
        />
      </If>

      <If condition={props.providers.oAuth.length}>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <OauthProviders
          enabledProviders={props.providers.oAuth}
          shouldCreateUser={true}
          paths={{
            callback: props.paths.callback,
            returnPath: props.paths.appHome,
          }}
        />
      </If>
    </>
  );
}

function getCallbackUrl(props: {
  paths: {
    callback: string;
    appHome: string;
  };

  inviteToken?: string;
}) {
  if (!isBrowser()) {
    return '';
  }

  const redirectPath = props.paths.callback;
  const origin = window.location.origin;
  const url = new URL(redirectPath, origin);

  if (props.inviteToken) {
    url.searchParams.set('invite_token', props.inviteToken);
  }

  const searchParams = new URLSearchParams(window.location.search);
  const next = searchParams.get('next');

  if (next) {
    url.searchParams.set('next', next);
  }

  return url.href;
}

function getDefaultValues() {
  if (!isBrowser()) {
    return { email: '' };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const inviteToken = searchParams.get('invite_token');

  if (!inviteToken) {
    return { email: '' };
  }

  return {
    email: searchParams.get('email') ?? '',
  };
}
