import { Fragment } from "react";

import Link from "next/link";

import { If } from "@/components/makerkit/if";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DefaultHeader({
  breadcrumbs,
  children,
}: {
  breadcrumbs: {
    title: string;
    url?: string;
  }[];
  children?: React.ReactNode;
}) {
  const items = breadcrumbs.slice(0, -1);
  const lastItem = breadcrumbs.at(-1);

  return (
    <div className="w-full flex-1">
      <header className="flex h-12 shrink-0 items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <If condition={lastItem}>
            {(lastItem) => (
              <>
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:!h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {items.map((item) => (
                      <Fragment key={item.title}>
                        {item.url ? (
                          <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                              <Link href={item.url}>{item.title}</Link>
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                        ) : (
                          <BreadcrumbItem key={item.url}>
                            {item.title}
                          </BreadcrumbItem>
                        )}
                        <BreadcrumbSeparator />
                      </Fragment>
                    ))}
                    <BreadcrumbItem>
                      <BreadcrumbPage>{lastItem.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            )}
          </If>
        </div>
        {children}
      </header>
    </div>
  );
}
