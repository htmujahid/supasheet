"use client";

import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePersonalAccountData } from "../lib/hooks/use-personal-account-data";
import { UpdateAccountDetailsFormContainer } from "./update-account-details-form-container";
import { UpdateAccountImageContainer } from "./update-account-image-container";

export function ProfileContainer({ userId }: { userId: string }) {
  const user = usePersonalAccountData(userId);

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
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
    </div>
  );
}
