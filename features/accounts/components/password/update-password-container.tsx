'use client';

import { useUser } from '@/lib/supabase/hooks/use-user';
import { Alert } from '@/components/ui/alert';
import { LoadingOverlay } from '@/components/makerkit/loading-overlay';
import { Trans } from '@/components/makerkit/trans';

import { UpdatePasswordForm } from './update-password-form';

export function UpdatePasswordFormContainer(
  props: React.PropsWithChildren<{
    callbackPath: string;
  }>,
) {
  const { data: user, isPending } = useUser();

  if (isPending) {
    return <LoadingOverlay fullPage={false} />;
  }

  if (!user) {
    return null;
  }

  const canUpdatePassword = user.identities?.some(
    (item) => item.provider === `email`,
  );

  if (!canUpdatePassword) {
    return <WarnCannotUpdatePasswordAlert />;
  }

  return <UpdatePasswordForm callbackPath={props.callbackPath} user={user} />;
}

function WarnCannotUpdatePasswordAlert() {
  return (
    <Alert variant={'warning'}>
      <Trans i18nKey={'account:cannotUpdatePassword'} />
    </Alert>
  );
}
