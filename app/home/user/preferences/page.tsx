"use client";

import { useTranslation } from "react-i18next";

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
import { AppearanceForm } from "@/features/users/components/appearance-form";
import { withI18n } from "@/lib/i18n/with-i18n";

function PreferencesPage() {
  const supportsLanguageSelection = useSupportMultiLanguage();

  return (
    <div className="flex flex-col gap-4">
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
  );
}

function useSupportMultiLanguage() {
  const { i18n } = useTranslation();
  const langs = (i18n?.options?.supportedLngs as string[]) ?? [];

  const supportedLangs = langs.filter((lang) => lang !== "cimode");

  return supportedLangs.length > 1;
}

export default withI18n(PreferencesPage);
