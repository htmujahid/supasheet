"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import appConfig from "@/config/app.config";
import authConfig from "@/config/auth.config";
import { CaptchaProvider } from "@/features/auth/captcha/client";
import { I18nProvider } from "@/lib/i18n/i18n.provider";
import { i18nResolver } from "@/lib/i18n/i18n.resolver";
import { getI18nSettings } from "@/lib/i18n/i18n.settings";

import { SidebarProvider } from "../ui/sidebar";
import { AuthProvider } from "./auth-provider";
import { ReactQueryProvider } from "./react-query-provider";

const captchaSiteKey = authConfig.captchaTokenSiteKey;

const CaptchaTokenSetter = dynamic(async () => {
  if (!captchaSiteKey) {
    return Promise.resolve(() => null);
  }

  const { CaptchaTokenSetter } = await import("@/features/auth/captcha/client");

  return {
    default: CaptchaTokenSetter,
  };
});

export function RootProviders({
  lang,
  theme = appConfig.theme,
  children,
}: React.PropsWithChildren<{
  lang: string;
  theme?: string;
}>) {
  const i18nSettings = useMemo(() => getI18nSettings(lang), [lang]);

  return (
    <ReactQueryProvider>
      <NuqsAdapter>
        <I18nProvider settings={i18nSettings} resolver={i18nResolver}>
          <CaptchaProvider>
            <CaptchaTokenSetter siteKey={captchaSiteKey} />

            <AuthProvider>
              <ThemeProvider
                attribute="class"
                enableSystem
                disableTransitionOnChange
                defaultTheme={theme}
                enableColorScheme={false}
              >
                <SidebarProvider
                  style={
                    {
                      "--sidebar-width": "calc(var(--spacing) * 72)",
                      "--header-height": "calc(var(--spacing) * 14)",
                    } as React.CSSProperties
                  }
                >
                  <div className="w-full">{children}</div>
                </SidebarProvider>
              </ThemeProvider>
            </AuthProvider>
          </CaptchaProvider>
        </I18nProvider>
      </NuqsAdapter>
    </ReactQueryProvider>
  );
}
