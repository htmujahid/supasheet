import { AppLogo } from "@/components/app-logo";
import { cn } from "@/lib/utils";

export function AuthLayout({
  children,
  isCoverImage = true,
}: {
  children: React.ReactNode;
  isCoverImage?: boolean;
}) {
  return (
    <div
      className={cn("grid min-h-svh", {
        "lg:grid-cols-2": isCoverImage,
      })}
    >
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start gap-2">
          <AppLogo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      {isCoverImage && (
        <div className="bg-muted relative hidden lg:block">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="max-w-2xl space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-6xl font-bold tracking-tighter text-transparent">
                  Your Complete CMS Solution
                </h2>
                <div className="from-primary/60 via-primary to-primary/60 mx-auto h-1 w-24 rounded-full bg-gradient-to-r" />
              </div>
              <p className="text-muted-foreground text-xl font-light tracking-wide">
                Open source platform with everything included
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
