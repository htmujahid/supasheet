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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
    </div>
  );
}
