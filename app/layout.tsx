import { cookies } from 'next/headers';

import { RootProviders } from '@/components/providers/root-providers';
import { Toaster } from '@/components/ui/sonner';
import { heading, sans, mono } from '@/lib/fonts';
import { createI18nServerInstance } from '@/lib/i18n/i18n.server';
import { generateRootMetadata } from '@/lib/root-metadata';
import { cn } from '@/lib/utils';

import './globals.css';
import { withI18n } from '@/lib/i18n/with-i18n';

async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = await createI18nServerInstance();
  const theme = await getTheme();
  const className = getClassName(theme);

  return (
    <html lang={language} className={className}>
      <body>
        <RootProviders theme={theme} lang={language}>
          {children}
        </RootProviders>

        <Toaster richColors={true} theme={theme} position="top-center" />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const font = [sans.variable, heading.variable, mono.variable].reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;

      return [...acc, curr];
    },
    [],
  );

  return cn('bg-background min-h-screen antialiased', ...font, {
    dark,
    light,
  });
}

async function getTheme() {
  const cookiesStore = await cookies();
  return cookiesStore.get('theme')?.value as 'light' | 'dark' | 'system';
}

export const generateMetadata = generateRootMetadata;

export default withI18n(RootLayout);