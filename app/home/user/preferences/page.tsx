"use client";

import { useTranslation } from "react-i18next";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { LanguageSelector } from "@/components/makerkit/language-selector";
import { Trans } from "@/components/makerkit/trans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppearanceForm } from "@/features/user/components/appearance-form";

function PreferencesPage() {
  const supportsLanguageSelection = useSupportMultiLanguage();

  return (
    <div>
      <DefaultHeader breadcrumbs={[{ title: "Preferences" }]} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey={"account:dangerZone"} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={"account:dangerZoneDescription"} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AppearanceForm />
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
      </div>
    </div>
  );
}

function useSupportMultiLanguage() {
  const { i18n } = useTranslation();
  const langs = (i18n?.options?.supportedLngs as string[]) ?? [];

  const supportedLangs = langs.filter((lang) => lang !== "cimode");

  return supportedLangs.length > 1;
}

export default PreferencesPage;
