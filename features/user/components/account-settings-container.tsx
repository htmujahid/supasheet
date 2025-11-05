"use client";

import { If } from "@/components/makerkit/if";
import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePersonalAccountData } from "../lib/hooks/use-personal-account-data";
import { AccountDangerZone } from "./account-danger-zone";
import { UpdateEmailFormContainer } from "./email/update-email-form-container";
import { MultiFactorAuthFactorsList } from "./mfa/multi-factor-auth-list";
import { UpdatePasswordFormContainer } from "./password/update-password-container";
import { UpdateAccountDetailsFormContainer } from "./update-account-details-form-container";
import { UpdateAccountImageContainer } from "./update-account-image-container";

export function PersonalAccountSettingsContainer(
  props: React.PropsWithChildren<{
    userId: string;

    features: {
      enableAccountDeletion: boolean;
      enablePasswordUpdate: boolean;
    };

    paths: {
      callback: string;
    };
  }>,
) {
  const user = usePersonalAccountData(props.userId);

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div className={"flex w-full flex-col space-y-4 pb-32"}>
      <Card>
        <CardHeader>
          <CardTitle>Your Profile Picture</CardTitle>

          <CardDescription>
            Please choose a photo to upload as your profile picture.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountImageContainer
            user={{
              pictureUrl: user.data.picture_url,
              id: user.data.id,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>

          <CardDescription>
            Update your name to be displayed on your profile
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountDetailsFormContainer user={user.data} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update your Email</CardTitle>

          <CardDescription>
            Update your email address you use to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateEmailFormContainer callbackPath={props.paths.callback} />
        </CardContent>
      </Card>

      <If condition={props.features.enablePasswordUpdate}>
        <Card>
          <CardHeader>
            <CardTitle>Update your Password</CardTitle>

            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <UpdatePasswordFormContainer callbackPath={props.paths.callback} />
          </CardContent>
        </Card>
      </If>

      <Card>
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>

          <CardDescription>
            Set up Multi-Factor Authentication method to further secure your
            account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <MultiFactorAuthFactorsList userId={props.userId} />
        </CardContent>
      </Card>

      <If condition={props.features.enableAccountDeletion}>
        <Card className={"border-destructive"}>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>

            <CardDescription>
              Some actions cannot be undone. Please be careful.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AccountDangerZone />
          </CardContent>
        </Card>
      </If>
    </div>
  );
}
