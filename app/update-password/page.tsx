import { Trans } from '@/components/makerkit/trans';
import pathsConfig from '@/config/paths.config';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { PasswordResetLayout } from '@/features/auth/components/password-reset-layout';
import { UpdatePasswordForm } from '@/features/auth/components/update-password-form';
import { createI18nServerInstance } from '@/lib/i18n/i18n.server';
import { withI18n } from '@/lib/i18n/with-i18n';
import { requireUserInServerComponent } from '@/lib/server/require-user-in-server-component';

export const generateMetadata = async () => {
  const { t } = await createI18nServerInstance();

  return {
    title: t('auth:updatePassword'),
  };
};

interface UpdatePasswordPageProps {
  searchParams: Promise<{
    callback?: string;
  }>;
}

async function UpdatePasswordPage(props: UpdatePasswordPageProps) {
  await requireUserInServerComponent();

  const { callback } = await props.searchParams;
  const redirectTo = callback ?? pathsConfig.app.home;

  return (
    <AuthLayout isCoverImage={false}>
      <PasswordResetLayout
        title={<Trans i18nKey={'auth:passwordResetLabel'} />}
        description={<Trans i18nKey={'auth:updatePasswordDescription'} />}
      >
        <UpdatePasswordForm redirectTo={redirectTo} />
      </PasswordResetLayout>
    </AuthLayout>
  );
}

export default withI18n(UpdatePasswordPage);
