"use client";

import { Fragment } from "react";

import { usePathname } from "next/navigation";

import { formatTitle } from "@/lib/format";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { If } from "./if";
import { Trans } from "./trans";

export function AppBreadcrumbs(props: {
  values?: Record<string, string>;
  maxDepth?: number;
}) {
  const pathName = usePathname();
  const splitPath = pathName.split("/").filter(Boolean);
  const values = props.values ?? {};
  const maxDepth = props.maxDepth ?? 3;

  const Ellipsis = (
    <BreadcrumbItem>
      <BreadcrumbEllipsis className="h-4 w-4" />
    </BreadcrumbItem>
  );

  const showEllipsis = splitPath.length > maxDepth;

  const visiblePaths = showEllipsis
    ? ([splitPath[0], ...splitPath.slice(-maxDepth + 1)] as string[])
    : splitPath;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visiblePaths.map((path, index) => {
          const label =
            path in values ? (
              values[path]
            ) : (
              <Trans
                i18nKey={`common:routes.${formatTitle(path)}`}
                defaults={formatTitle(path)}
              />
            );

          return (
            <Fragment key={index}>
              <BreadcrumbItem className={"capitalize lg:text-xs"}>
                <If
                  condition={index < visiblePaths.length - 1}
                  fallback={label}
                >
                  <BreadcrumbLink
                    href={
                      "/" +
                      splitPath.slice(0, splitPath.indexOf(path) + 1).join("/")
                    }
                  >
                    {label}
                  </BreadcrumbLink>
                </If>
              </BreadcrumbItem>

              {index === 0 && showEllipsis && (
                <>
                  <BreadcrumbSeparator />
                  {Ellipsis}
                </>
              )}

              <If condition={index !== visiblePaths.length - 1}>
                <BreadcrumbSeparator />
              </If>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
