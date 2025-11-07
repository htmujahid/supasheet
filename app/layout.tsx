import { cookies } from "next/headers";

import { RootProviders } from "@/components/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";
import { heading, mono, sans } from "@/lib/fonts";
import { generateRootMetadata } from "@/lib/root-metadata";
import { cn } from "@/lib/utils";

import "../styles/globals.css";

async function RootLayout({ children }: React.PropsWithChildren) {
  const theme = await getTheme();
  const className = getClassName(theme);

  return (
    <html lang={"en"} className={className}>
      <body>
        <RootProviders theme={theme}>{children}</RootProviders>

        <Toaster richColors={true} theme={theme} position="top-center" />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === "dark";
  const light = !dark;

  const font = [sans.variable, heading.variable, mono.variable].reduce<
    string[]
  >((acc, curr) => {
    if (acc.includes(curr)) return acc;

    return [...acc, curr];
  }, []);

  return cn(
    "bg-background text-foreground group/body min-h-screen overscroll-none antialiased",
    ...font,
    {
      dark,
      light,
    },
  );
}

async function getTheme() {
  const cookiesStore = await cookies();
  return cookiesStore.get("theme")?.value as "light" | "dark" | "system";
}

export const generateMetadata = generateRootMetadata;

export default RootLayout;
