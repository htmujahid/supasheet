"use client";

import { useCallback } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";

import { toast } from "sonner";

import { ImageUploader } from "@/components/makerkit/image-uploader";
import { Database } from "@/lib/database.types";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

import { useRevalidatePersonalAccountDataQuery } from "../lib/hooks/use-personal-account-data";

const AVATARS_BUCKET = "account_image";

export function UpdateAccountImageContainer({
  user,
}: {
  user: {
    pictureUrl: string | null;
    id: string;
  };
}) {
  const revalidateUserDataQuery = useRevalidatePersonalAccountDataQuery();

  return (
    <UploadProfileAvatarForm
      pictureUrl={user.pictureUrl ?? null}
      userId={user.id}
      onAvatarUpdated={() => revalidateUserDataQuery(user.id)}
    />
  );
}

function UploadProfileAvatarForm({
  pictureUrl,
  userId,
  onAvatarUpdated,
}: {
  pictureUrl: string | null;
  userId: string;
  onAvatarUpdated: () => void;
}) {
  const client = useSupabase();
  const createToaster = useCallback((promise: () => Promise<unknown>) => {
    return toast.promise(promise, {
      success: "Profile updated successfully",
      error: "Failed to update profile",
      loading: "Updating profile...",
    });
  }, []);

  const onValueChange = useCallback(
    (file: File | null) => {
      const removeExistingStorageFile = () => {
        if (pictureUrl) {
          return deleteProfilePhoto(client, pictureUrl) ?? Promise.resolve();
        }

        return Promise.resolve();
      };

      if (file) {
        const promise = () =>
          removeExistingStorageFile().then(() =>
            uploadUserProfilePhoto(client, file, userId)
              .then((pictureUrl) => {
                return client
                  .schema("supasheet")
                  .from("accounts")
                  .update({
                    picture_url: pictureUrl,
                  })
                  .eq("id", userId)
                  .throwOnError();
              })
              .then(() => {
                onAvatarUpdated();
              }),
          );

        createToaster(promise);
      } else {
        const promise = () =>
          removeExistingStorageFile()
            .then(() => {
              return client
                .schema("supasheet")
                .from("accounts")
                .update({
                  picture_url: null,
                })
                .eq("id", userId)
                .throwOnError();
            })
            .then(() => {
              onAvatarUpdated();
            });

        createToaster(promise);
      }
    },
    [client, createToaster, pictureUrl, userId, onAvatarUpdated],
  );

  return (
    <ImageUploader value={pictureUrl} onValueChange={onValueChange}>
      <div className={"flex flex-col space-y-1"}>
        <span className={"text-sm"}>Upload a Profile Picture</span>

        <span className={"text-xs"}>
          Choose a photo to upload as your profile picture.
        </span>
      </div>
    </ImageUploader>
  );
}

function deleteProfilePhoto(client: SupabaseClient<Database>, url: string) {
  const bucket = client.storage.from(AVATARS_BUCKET);
  const fileName = url.split("/").pop()?.split("?")[0];

  if (!fileName) {
    return;
  }

  return bucket.remove([fileName]);
}

async function uploadUserProfilePhoto(
  client: SupabaseClient<Database>,
  photoFile: File,
  userId: string,
) {
  const bytes = await photoFile.arrayBuffer();
  const bucket = client.storage.from(AVATARS_BUCKET);
  const extension = photoFile.name.split(".").pop();
  const fileName = await getAvatarFileName(userId, extension);

  const result = await bucket.upload(fileName, bytes);

  if (!result.error) {
    return bucket.getPublicUrl(fileName).data.publicUrl;
  }

  throw result.error;
}

async function getAvatarFileName(
  userId: string,
  extension: string | undefined,
) {
  const { nanoid } = await import("nanoid");

  // we add a version to the URL to ensure
  // the browser always fetches the latest image
  const uniqueId = nanoid(16);

  return `${userId}/account-image.${extension}?v=${uniqueId}`;
}
