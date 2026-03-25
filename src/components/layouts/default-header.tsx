import { Fragment } from "react"

import { Link } from "@tanstack/react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb"
import { Separator } from "#/components/ui/separator"
import { SidebarTrigger } from "#/components/ui/sidebar"

export function DefaultHeader({
  breadcrumbs,
  children,
}: {
  breadcrumbs: {
    title: string
    url?: string
  }[]
  children?: React.ReactNode
}) {
  const items = breadcrumbs.slice(0, -1)
  const lastItem = breadcrumbs.at(-1)

  return (
    <div className="w-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          {lastItem && (
            <>
              <Separator
                orientation="vertical"
                className="mt-1.5 mr-2 data-[orientation=vertical]:!h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {items.map((item) => (
                    <Fragment key={item.title}>
                      {item.url ? (
                        <BreadcrumbItem>
                          <BreadcrumbLink render={<Link to={item.url} />}>
                            {item.title}
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
        </div>
        {children}
      </header>
    </div>
  )
}
