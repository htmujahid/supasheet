"use client";

import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePersonalAccountData } from "../hooks/use-personal-account-data";
import { UpdateAccountDetailsFormContainer } from "./update-account-details-form-container";
import { UpdateAccountImageContainer } from "./update-account-image-container";

export function ProfileContainer({ userId }: { userId: string }) {
  const user = usePersonalAccountData(userId);

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={"account:accountImage"} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={"account:accountImageDescription"} />
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
          <CardTitle>
            <Trans i18nKey={"account:name"} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={"account:nameDescription"} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountDetailsFormContainer user={user.data} />
        </CardContent>
      </Card>
    </div>
  );
}
