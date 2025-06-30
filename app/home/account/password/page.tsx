import { Trans } from '@/components/makerkit/trans';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';
import { UpdatePasswordFormContainer } from '@/features/accounts/components/password/update-password-container';

export default function PasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans i18nKey={'account:updatePasswordCardTitle'} />
        </CardTitle>

        <CardDescription>
          <Trans i18nKey={'account:updatePasswordCardDescription'} />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UpdatePasswordFormContainer callbackPath={pathsConfig.auth.callback} />
      </CardContent>
    </Card>
  );
}
