import Link from "next/link";

import { cn } from "@/lib/utils";

function LogoImage({
  className,
  // width = 16,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <div className={cn("flex w-fit items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      </svg>
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
