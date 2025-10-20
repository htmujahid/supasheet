import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-1">
      <header className="flex h-12 shrink-0 items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:!h-4"
          />
          <AppBreadcrumbs />
        </div>
      </header>
      <div className="">{children}</div>
    </div>
  );
}
