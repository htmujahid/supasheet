import type {
  ColumnSchema,
  PrimaryKey,
  Relationship,
  TableMetadata,
  TableSchema,
} from "#/lib/database-meta.types"

const deriveAlias = (column: string) =>
  column.endsWith("_id") ? column.slice(0, -3) : `${column}_ref`

export type RelatedTable = Omit<
  TableSchema,
  "columns" | "relationships" | "primary_keys"
> & {
  columns: ColumnSchema[]
  relationships: Relationship[]
  primary_keys: PrimaryKey[]
}

export type ManyRelation = RelatedTable & {
  __parentColumn: string
  __targetColumn: string
  __selectClause: string
}

export type OneToOneRelation = RelatedTable & {
  __embedKey: string
  __fkColumn: string
  __foreignMatchColumn: string
  __parentMatchColumn: string
}

export type ClassifiedRelationships = {
  oneToOneRelationships: OneToOneRelation[]
  oneToManyRelationships: ManyRelation[]
  manyToManyRelationships: ManyRelation[]
  joins: Required<TableMetadata>["query"]["join"]
}

export function classifyRelationships(
  schema: string,
  resource: string,
  relatedTablesSchema: unknown
): ClassifiedRelationships {
  const tables = (relatedTablesSchema ?? []) as RelatedTable[]

  const oneToOneRelationships: OneToOneRelation[] = []
  const oneToManyRelationships: ManyRelation[] = []
  const manyToManyRelationships: ManyRelation[] = []
  const joins: Required<TableMetadata>["query"]["join"] = []

  for (const table of tables) {
    const oneToOneAsSourceList = (table.relationships ?? []).filter(
      (rel) =>
        rel.source_schema === schema && rel.source_table_name === resource
    )
    if (oneToOneAsSourceList.length > 0) {
      for (const rel of oneToOneAsSourceList) {
        const alias = deriveAlias(rel.source_column_name)
        joins.push({
          table: rel.target_table_name,
          on: rel.source_column_name,
          alias,
          columns: ["*"],
        })
        oneToOneRelationships.push({
          ...table,
          __embedKey: alias,
          __fkColumn: rel.source_column_name,
          __foreignMatchColumn: rel.target_column_name,
          __parentMatchColumn: rel.source_column_name,
        })
      }
      continue
    }

    const oneToOneAsTarget = table.relationships?.find(
      (rel) =>
        rel.target_table_schema === schema &&
        rel.target_table_name === resource &&
        (table.columns
          .filter((col) => col.is_unique)
          .some((col) => col.name === rel.source_column_name) ||
          (table.primary_keys.some(
            (key) => key.name === rel.source_column_name
          ) &&
            table.primary_keys.length === 1))
    )
    if (oneToOneAsTarget) {
      const alias = deriveAlias(oneToOneAsTarget.source_column_name)
      joins.push({
        table: oneToOneAsTarget.source_table_name,
        on: oneToOneAsTarget.source_column_name,
        alias,
        columns: ["*"],
      })
      oneToOneRelationships.push({
        ...table,
        __embedKey: alias,
        __fkColumn: oneToOneAsTarget.source_column_name,
        __foreignMatchColumn: oneToOneAsTarget.source_column_name,
        __parentMatchColumn: oneToOneAsTarget.target_column_name,
      })
      continue
    }

    const m2mRel = table.relationships?.find(
      (rel) =>
        rel.target_table_schema === schema &&
        rel.target_table_name === resource &&
        table.relationships.length >= 2 &&
        table.primary_keys.length >= 2 &&
        table.primary_keys.some((key) => key.name === rel.source_column_name)
    )
    if (m2mRel) {
      const otherRel = table.relationships.find(
        (r) =>
          table.primary_keys.some((k) => k.name === r.source_column_name) &&
          !(
            r.target_table_schema === schema && r.target_table_name === resource
          )
      )
      manyToManyRelationships.push({
        ...table,
        __parentColumn: m2mRel.source_column_name,
        __targetColumn: m2mRel.target_column_name,
        __selectClause: otherRel
          ? `*, ...${otherRel.target_table_name}(*)`
          : "*",
      })
      continue
    }

    const oneToManyRel = table.relationships?.find(
      (rel) =>
        rel.target_table_schema === schema &&
        rel.target_table_name === resource &&
        !(
          table.columns
            .filter((col) => col.is_unique)
            .some((col) => col.name === rel.source_column_name) ||
          table.primary_keys.some((key) => key.name === rel.source_column_name)
        )
    )
    if (oneToManyRel) {
      oneToManyRelationships.push({
        ...table,
        __parentColumn: oneToManyRel.source_column_name,
        __targetColumn: oneToManyRel.target_column_name,
        __selectClause: "*",
      })
    }
  }

  return {
    oneToOneRelationships,
    oneToManyRelationships,
    manyToManyRelationships,
    joins,
  }
}
