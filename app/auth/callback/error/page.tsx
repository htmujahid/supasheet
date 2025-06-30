import Link from 'next/link';

import type { AuthError } from '@supabase/supabase-js';

import { Trans } from '@/components/makerkit/trans';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import pathsConfig from '@/config/paths.config';
import { ResendAuthLinkForm } from '@/features/auth/components/resend-auth-link-form';
import { withI18n } from '@/lib/i18n/with-i18n';

interface AuthCallbackErrorPageProps {
  searchParams: Promise<{
    error: string;
    callback?: string;
    email?: string;
    code?: AuthError['code'];
  }>;
}

async function AuthCallbackErrorPage(props: AuthCallbackErrorPageProps) {
  const { error, callback, code } = await props.searchParams;
  const signInPath = pathsConfig.auth.signIn;
  const redirectPath = callback ?? pathsConfig.auth.callback;

  return (
    <div className={'flex flex-col space-y-4 py-4'}>
      <Alert variant={'warning'}>
        <AlertTitle>
          <Trans i18nKey={'auth:authenticationErrorAlertHeading'} />
        </AlertTitle>

        <AlertDescription>
          <Trans i18nKey={error ?? 'auth:authenticationErrorAlertBody'} />
        </AlertDescription>
      </Alert>

      <AuthCallbackForm
        code={code}
        signInPath={signInPath}
        redirectPath={redirectPath}
      />
    </div>
  );
}

function AuthCallbackForm(props: {
  signInPath: string;
  redirectPath?: string;
  code?: AuthError['code'];
}) {
  switch (props.code) {
    case 'otp_expired':
      return <ResendAuthLinkForm redirectPath={props.redirectPath} />;
    default:
      return <SignInButton signInPath={props.signInPath} />;
  }
}

function SignInButton(props: { signInPath: string }) {
  return (
    <Button className={'w-full'} asChild>
      <Link href={props.signInPath}>
        <Trans i18nKey={'auth:signIn'} />
      </Link>
    </Button>
  );
}

export default withI18n(AuthCallbackErrorPage);
