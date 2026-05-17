import { useMemo } from "react"

import { useNavigate } from "@tanstack/react-router"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import type {
  ColumnSchema,
  FormMode,
  PrimaryKey,
  TableMetadata,
  TableSchema,
} from "#/lib/database-meta.types"

import { ResourceFormField } from "./fields/resource-form-field"
import type { ResourceFormApi } from "./form-hook"
import type { ResolvedFieldSection } from "./resource-form-utils"
import { buildLayoutPlan, getColumnFieldSpan } from "./resource-form-utils"

type PrimaryKeyDisplay = { name: string; value: string }

type ResourceFormLayoutProps = {
  tableSchema: TableSchema
  writableCols: ColumnSchema[]
  form: ResourceFormApi
  mode: FormMode
  primaryKeyDisplay?: PrimaryKeyDisplay[]
  headerTitle: string
  redirect?: string
  saveOnly?: boolean
}

export function ResourceFormLayout({
  tableSchema,
  writableCols,
  form,
  mode,
  primaryKeyDisplay,
  headerTitle,
  redirect,
  saveOnly,
}: ResourceFormLayoutProps) {
  const navigate = useNavigate()
  const schema = tableSchema?.schema
  const resource = tableSchema?.name
  const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]
  const showSecondary = primaryKeys.length > 0

  const tableMeta = useMemo(
    () => JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata,
    [tableSchema?.comment]
  )
  const { plan, colByName } = useMemo(() => {
    const writableNames = new Set(writableCols.map((c) => c.name ?? c.id ?? ""))
    return {
      plan: buildLayoutPlan(tableMeta.sections, writableNames, mode),
      colByName: new Map(writableCols.map((c) => [c.name ?? c.id ?? "", c])),
    }
  }, [tableMeta.sections, writableCols, mode])

  const handleCancel = () => {
    if (redirect) {
      navigate({ to: redirect })
      return
    }
    if (!schema || !resource) return
    navigate({
      to: "/$schema/resource/$resource",
      params: { schema, resource },
    })
  }

  const handlePrimary = () => {
    void form.handleSubmit({ target: "stay" } as never)
  }

  const handleSecondary = () => {
    void form.handleSubmit({ target: "close" } as never)
  }

  const submitButtons = (
    <form.Subscribe
      selector={(s) => ({
        isSubmitting: s.isSubmitting,
        canSubmit: s.canSubmit,
      })}
    >
      {({ isSubmitting, canSubmit }) => (
        <>
          <Button
            type="button"
            variant={!saveOnly && showSecondary ? "outline" : "default"}
            disabled={!canSubmit || isSubmitting}
            onClick={handlePrimary}
          >
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
          {!saveOnly && showSecondary ? (
            <Button
              type="button"
              disabled={!canSubmit || isSubmitting}
              onClick={handleSecondary}
            >
              {isSubmitting ? "Saving…" : "Save & Close"}
            </Button>
          ) : null}
        </>
      )}
    </form.Subscribe>
  )

  const footer = (
    <div className="flex flex-wrap justify-end gap-2 pt-4">
      {!saveOnly ? (
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      ) : null}
      {submitButtons}
    </div>
  )

  // Fallback: no layout metadata. Preserve the original single-card UX so
  // unmigrated tables don't change visually.
  if (!plan) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{headerTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            {primaryKeyDisplay?.map((pk) => (
              <Field key={pk.name} className="md:col-span-2">
                <FieldLabel>{pk.name}</FieldLabel>
                <Input
                  value={pk.value}
                  disabled
                  className="font-mono text-xs text-muted-foreground"
                />
              </Field>
            ))}
            {writableCols.map((col) => {
              const span = getColumnFieldSpan(col, tableSchema)
              return (
                <div
                  key={col.id}
                  className={span === 2 ? "md:col-span-2" : undefined}
                >
                  <ResourceFormField
                    columnSchema={col}
                    tableSchema={tableSchema}
                    form={form}
                  />
                </div>
              )
            })}
          </CardContent>
          <CardFooter className="flex-wrap justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {submitButtons}
          </CardFooter>
        </Card>
      </div>
    )
  }

  const pkCard =
    primaryKeyDisplay && primaryKeyDisplay.length ? (
      <Card>
        <CardHeader>
          <CardTitle>Identifiers</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          {primaryKeyDisplay.map((pk) => (
            <Field key={pk.name} className="md:col-span-2">
              <FieldLabel>{pk.name}</FieldLabel>
              <Input
                value={pk.value}
                disabled
                className="font-mono text-xs text-muted-foreground"
              />
            </Field>
          ))}
        </CardContent>
      </Card>
    ) : null

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      {pkCard}
      {plan.sections.map((s) => (
        <SectionCard
          key={s.id}
          section={s}
          colByName={colByName}
          tableSchema={tableSchema}
          form={form}
        />
      ))}
      {footer}
    </div>
  )
}

function SectionCard({
  section,
  colByName,
  tableSchema,
  form,
}: {
  section: ResolvedFieldSection
  colByName: Map<string, ColumnSchema>
  tableSchema: TableSchema
  form: ResourceFormApi
}) {
  const body = (
    <CardContent className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
      {section.fields.map((name) => {
        const col = colByName.get(name)
        if (!col) return null
        const span = getColumnFieldSpan(col, tableSchema)
        return (
          <div
            key={col.id}
            className={span === 2 ? "md:col-span-2" : undefined}
          >
            <ResourceFormField
              columnSchema={col}
              tableSchema={tableSchema}
              form={form}
            />
          </div>
        )
      })}
    </CardContent>
  )

  if (!section.collapsible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
          {section.description ? (
            <CardDescription>{section.description}</CardDescription>
          ) : null}
        </CardHeader>
        {body}
      </Card>
    )
  }

  return (
    <Collapsible defaultOpen={false}>
      <Card>
        <CollapsibleTrigger
          render={
            <button
              type="button"
              className="group/section-trigger w-full cursor-pointer text-left"
            />
          }
        >
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <CardTitle>{section.title}</CardTitle>
              {section.description ? (
                <CardDescription>{section.description}</CardDescription>
              ) : null}
            </div>
            <ChevronDownIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]/section-trigger:rotate-180" />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>{body}</CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
