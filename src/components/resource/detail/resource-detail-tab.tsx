import { Suspense } from "react"

import { Link, Outlet } from "@tanstack/react-router"

import { useQuery } from "@tanstack/react-query"

import { LinkIcon } from "lucide-react"

import { DataTableSkeleton } from "#/components/data-table/data-table-skeleton"
import type {
  ManyRelation,
  OneToOneRelation,
} from "#/components/resource/detail/classify-relationships"
import { ResourceForeignTable } from "#/components/resource/detail/resource-foreign-table"
import { ResourceFullDetail } from "#/components/resource/detail/resource-full-detail"
import { ResourceUpdateForm } from "#/components/resource/resource-update-form"
import { buttonVariants } from "#/components/ui/button"
import { Card, CardContent } from "#/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import type { ResourceSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import { singleForeignTableDataQueryOptions } from "#/lib/supabase/data/resource"

type Props = {
  schema: string
  resource: string
  resourceId: string
  parentRecord: Record<string, unknown> | null | undefined
  oneToOne: OneToOneRelation | undefined
  many: ManyRelation | undefined
  canUpdateOneToOne: boolean
  canUpdateParent: boolean
}

export function ResourceDetailTab({
  schema,
  resource,
  resourceId,
  parentRecord,
  oneToOne,
  many,
  canUpdateOneToOne,
  canUpdateParent,
}: Props) {
  const matchValue = oneToOne
    ? parentRecord?.[oneToOne.__parentMatchColumn]
    : null

  const foreignOpts =
    oneToOne && matchValue != null
      ? singleForeignTableDataQueryOptions(oneToOne.schema, oneToOne.name, {
          [oneToOne.__foreignMatchColumn]: matchValue,
        })
      : null

  const { data: foreignRecord } = useQuery({
    queryKey: foreignOpts?.queryKey ?? ["resource-detail-tab", "disabled"],
    queryFn: foreignOpts?.queryFn ?? (() => null),
    staleTime: foreignOpts?.staleTime ?? 0,
    enabled: foreignOpts != null,
  })

  if (oneToOne) {
    const primaryKeys = oneToOne.primary_keys ?? []
    const embedded = foreignRecord
    const hasPkValues =
      primaryKeys.length > 0 &&
      primaryKeys.every((k) => embedded != null && embedded[k.name] != null)
    const isUnlinked = matchValue == null || embedded == null || !hasPkValues

    if (isUnlinked) {
      const relatedName = formatTitle(oneToOne.name)
      const parentName = formatTitle(resource)
      const parentDetailHref = `/${schema}/resource/${resource}/${resourceId}/detail`
      return (
        <>
          <div className="mx-auto w-full max-w-5xl space-y-4">
            <Card>
              <CardContent className="py-8">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <LinkIcon />
                    </EmptyMedia>
                    <EmptyTitle>No linked {relatedName}</EmptyTitle>
                    <EmptyDescription>
                      This {parentName} record is not linked to a {relatedName}.
                      {canUpdateParent
                        ? ` Edit this record and set "${oneToOne.__fkColumn}" to link one.`
                        : null}
                    </EmptyDescription>
                  </EmptyHeader>
                  {canUpdateParent ? (
                    <EmptyContent>
                      <Link
                        to={parentDetailHref}
                        className={buttonVariants({
                          size: "sm",
                          variant: "outline",
                        })}
                      >
                        Edit {parentName}
                      </Link>
                    </EmptyContent>
                  ) : null}
                </Empty>
              </CardContent>
            </Card>
          </div>
          <Outlet />
        </>
      )
    }

    if (canUpdateOneToOne) {
      return (
        <>
          <ResourceUpdateForm
            columnsSchema={oneToOne.columns ?? []}
            primaryKeys={primaryKeys}
            record={embedded}
            tableSchema={oneToOne}
            saveOnly
          />
          <Outlet />
        </>
      )
    }

    return (
      <>
        <ResourceFullDetail
          resourceSchema={
            {
              ...oneToOne,
              name: oneToOne.__embedKey,
            } as unknown as ResourceSchema
          }
          columnsSchema={oneToOne.columns ?? []}
          record={embedded}
        />
        <Outlet />
      </>
    )
  }

  if (!many) return null

  const {
    columns,
    __parentColumn,
    __targetColumn,
    __selectClause,
    ...resourceSchema
  } = many

  const parentValue = parentRecord?.[__targetColumn]

  return (
    <>
      <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
        <ResourceForeignTable
          parentResource={resource}
          parentColumn={__parentColumn}
          parentValue={parentValue}
          resourceSchema={resourceSchema}
          columnsSchema={columns ?? []}
          selectClause={__selectClause}
        />
      </Suspense>
      <Outlet />
    </>
  )
}
