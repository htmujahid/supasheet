"use client";

import dynamic from "next/dynamic";

import { loader } from "@monaco-editor/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import appConfig from "@/config/app.config";
import authConfig from "@/config/auth.config";
import { CaptchaProvider } from "@/features/auth/components/captcha/captcha-provider";

import { AuthProvider } from "./auth-provider";
import { ReactQueryProvider } from "./react-query-provider";

const captchaSiteKey = authConfig.captchaTokenSiteKey;

const CaptchaTokenSetter = dynamic(async () => {
  if (!captchaSiteKey) {
    return Promise.resolve(() => null);
  }

  const { CaptchaTokenSetter } = await import(
    "@/features/auth/components/captcha/captcha-token-setter"
  );

  return {
    default: CaptchaTokenSetter,
  };
});

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs",
  },
});

export function RootProviders({
  theme = appConfig.theme,
  children,
}: React.PropsWithChildren<{
  theme?: string;
}>) {
  return (
    <ReactQueryProvider>
      <NuqsAdapter>
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
              <div className="w-full">{children}</div>
            </ThemeProvider>
          </AuthProvider>
        </CaptchaProvider>
      </NuqsAdapter>
    </ReactQueryProvider>
  );
}
