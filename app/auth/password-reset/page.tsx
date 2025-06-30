import Link from 'next/link';

import { Trans } from '@/components/makerkit/trans';
import pathsConfig from '@/config/paths.config';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { PasswordResetLayout } from '@/features/auth/components/password-reset-layout';
import { PasswordResetRequestContainer } from '@/features/auth/components/password-reset-request-container';
import { createI18nServerInstance } from '@/lib/i18n/i18n.server';
import { withI18n } from '@/lib/i18n/with-i18n';

export const generateMetadata = async () => {
  const { t } = await createI18nServerInstance();

  return {
    title: t('auth:passwordResetLabel'),
  };
};

const { callback, passwordUpdate, signIn } = pathsConfig.auth;
const redirectPath = `${callback}?next=${passwordUpdate}`;

function PasswordResetPage() {
  return (
    <AuthLayout isCoverImage={false}>
      <PasswordResetLayout
        title={<Trans i18nKey={'auth:passwordResetLabel'} />}
        description={<Trans i18nKey={'auth:passwordResetSubheading'} />}
      >
        <PasswordResetRequestContainer redirectPath={redirectPath} />

        <div className={'flex justify-center text-sm'}>
          <Link href={signIn} className="hover:underline">
            <Trans i18nKey={'auth:passwordRecoveredQuestion'} />
          </Link>
        </div>
      </PasswordResetLayout>
    </AuthLayout>
  );
}

export default withI18n(PasswordResetPage);
