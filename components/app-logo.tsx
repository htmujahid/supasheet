import Link from "next/link";

import { Grid2X2PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function LogoImage({
  className,
  width = 16,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <div className={cn("flex w-fit items-center gap-1", className)}>
      <Grid2X2PlusIcon width={width} />
      <span>Supasheet.</span>
    </div>
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? "Home Page"} href={href ?? "/"}>
      <LogoImage className={className} />
    </Link>
  );
}
