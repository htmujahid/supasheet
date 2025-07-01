"use client";

import { useTranslation } from "react-i18next";

import { If } from "@/components/makerkit/if";
import { LanguageSelector } from "@/components/makerkit/language-selector";
import { LoadingOverlay } from "@/components/makerkit/loading-overlay";
import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import pathsConfig from "@/config/paths.config";

import { usePersonalAccountData } from "../hooks/use-personal-account-data";
import { UpdateEmailFormContainer } from "./email/update-email-form-container";
import { UpdateAccountDetailsFormContainer } from "./update-account-details-form-container";
import { UpdateAccountImageContainer } from "./update-account-image-container";

export function ProfileContainer({ userId }: { userId: string }) {
  const user = usePersonalAccountData(userId);
  const supportsLanguageSelection = useSupportMultiLanguage();

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

      <If condition={supportsLanguageSelection}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey={"account:language"} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={"account:languageDescription"} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LanguageSelector />
          </CardContent>
        </Card>
      </If>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={"account:updateEmailCardTitle"} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={"account:updateEmailCardDescription"} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateEmailFormContainer callbackPath={pathsConfig.auth.callback} />
        </CardContent>
      </Card>
    </div>
  );
}

function useSupportMultiLanguage() {
  const { i18n } = useTranslation();
  const langs = (i18n?.options?.supportedLngs as string[]) ?? [];

  const supportedLangs = langs.filter((lang) => lang !== "cimode");

  return supportedLangs.length > 1;
}
