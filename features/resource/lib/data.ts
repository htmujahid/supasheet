import { useQuery } from "@tanstack/react-query";

import { SYSTEM_SCHEMAS } from "@/config/database.config";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  ResourceDataSchema,
  TableMetadata,
  ViewMetadata,
} from "@/lib/database-meta.types";
import { Database } from "@/lib/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";
import { applyAndFilters } from "@/lib/supabase/filters";

import { ResourceSearchParams } from "./validations";

export function useColumnsSchema(schema: string, id: string) {
  return useQuery({
    queryKey: ["columns-schema", id],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();

      const columnResponse = await client
        .schema("supasheet")
        .rpc("get_columns", { schema_name: schema, table_name: id });

      return columnResponse.data;
    },
    enabled: !!schema && !!id,
  });
}

export function useTableSchema(schema: string, id: string) {
  const client = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["table-schema", schema, id],
    queryFn: async () => {
      const tableResponse = await client
        .schema("supasheet")
        .rpc("get_tables", { schema_name: schema, table_name: id });

      if (tableResponse.error) {
        return null;
      }

      return tableResponse.data?.[0] || null;
    },
    enabled: !!id && !!schema,
  });
}

export function useResourceData(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
  input: ResourceSearchParams,
) {
  return useQuery({
    queryKey: ["resource-data", schema, id, input],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();
      const { page, perPage, sort, filters } = input;

      const query = client
        .schema(schema)
        .from(id)
        .select("*", { count: "exact" })
        .range((page - 1) * perPage, page * perPage - 1);

      sort.forEach((item) => {
        query.order(item.id, { ascending: item.desc });
      });
      // Apply user filters based on join operator
      applyAndFilters(query, filters);

      const response = await query;
      const total = response.count;

      return {
        results: response.data ?? [],
        total: total ?? 0,
        page: Number(page),
        perPage: Number(perPage),
      };
    },
    enabled: !!id,
  });
}

export function useSingleResourceData(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
  pk: Record<string, unknown>,
) {
  const client = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["single-resource-data", schema, id, pk],
    queryFn: async () => {
      const query = client.schema(schema).from(id).select("*");

      Object.entries(pk).forEach(([key, value]) => {
        query.eq(key, value as string);
      });

      return (await query).data?.[0] as unknown as ResourceDataSchema;
    },
    enabled: !!schema && !!id,
  });
}

export function useSchemas() {
  const client = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["database-schemas"],
    queryFn: async () => {
      const schemaResponse = await client
        .schema("supasheet")
        .rpc("get_schemas");
      return (
        schemaResponse.data?.filter(
          (schema) => !SYSTEM_SCHEMAS.includes(schema.schema),
        ) ?? []
      );
    },
  });
}

export function useResources(schema: string) {
  const client = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["table-resources", schema],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      const tableSchema = await client
        .schema("supasheet")
        .rpc("get_tables", { schema_name: schema });
      const tableResources =
        tableSchema.data
          ?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            schema: resource.schema as string,
            type: "table" as const,
            meta: (resource.comment
              ? JSON.parse(resource.comment)
              : {}) as TableMetadata,
          }))
          ?.filter((resource) => resource.meta.display !== "none") ?? [];

      const viewSchema = await client
        .schema("supasheet")
        .rpc("get_views", { schema_name: schema });

      const viewResources =
        viewSchema.data
          ?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            schema: resource.schema as string,
            type: "view" as const,
            meta: (resource.comment
              ? JSON.parse(resource.comment)
              : {}) as ViewMetadata,
          }))
          ?.filter((resource) => resource.meta.display === "block") ?? [];

      const materializedViewSchema = await client
        .schema("supasheet")
        .rpc("get_materialized_views", { schema_name: schema });

      const materializedViewResources =
        materializedViewSchema.data
          ?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            schema: resource.schema as string,
            type: "view" as const,
            meta: (resource.comment
              ? JSON.parse(resource.comment)
              : {}) as ViewMetadata,
          }))
          ?.filter((resource) => resource.meta.display === "block") ?? [];

      return [
        ...tableResources,
        ...viewResources,
        ...materializedViewResources,
      ];
    },
  });
}

export function useTableResources(schema: string) {
  const client = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["table-resources", schema],
    queryFn: async () => {
      const tableSchema = await client
        .schema("supasheet")
        .rpc("get_tables", { schema_name: schema });
      const tableResources =
        tableSchema.data
          ?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            schema: resource.schema as string,
            type: "table" as const,
            meta: (resource.comment
              ? JSON.parse(resource.comment)
              : {}) as TableMetadata,
          }))
          ?.filter((resource) => resource.meta.display !== "none") ?? [];
      return tableResources;
    },
  });
}

export function useViewResources(schema: string) {
  const client = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["view-resources", schema],
    queryFn: async () => {
      const viewSchema = await client
        .schema("supasheet")
        .rpc("get_views", { schema_name: schema });

      const viewResources =
        viewSchema.data
          ?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            schema: resource.schema as string,
            type: "view" as const,
            meta: (resource.comment
              ? JSON.parse(resource.comment)
              : {}) as ViewMetadata,
          }))
          ?.filter((resource) => resource.meta.display !== "none") ?? [];

      const materializedViewSchema = await client
        .schema("supasheet")
        .rpc("get_materialized_views", { schema_name: schema });

      const materializedViewResources =
        materializedViewSchema.data
          ?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            schema: resource.schema as string,
            type: "view" as const,
            meta: (resource.comment
              ? JSON.parse(resource.comment)
              : {}) as ViewMetadata,
          }))
          ?.filter((resource) => resource.meta.display !== "none") ?? [];

      return [...viewResources, ...materializedViewResources];
    },
  });
}

// export async function loadResourcePermissions<Schema extends DatabaseSchemas>(
//   schema: Schema,
//   id: DatabaseTables<Schema> | DatabaseViews<Schema>,
// ) {
//   const client = await getSupabaseServerClient();

//   const response = await client
//     .schema("supasheet")
//     .from("role_permissions")
//     .select()
//     .in("permission", [
//       `${schema}.${id}:select`,
//       `${schema}.${id}:insert`,
//       `${schema}.${id}:update`,
//       `${schema}.${id}:delete`,
//     ] as Database["supasheet"]["Enums"]["app_permission"][]);

//   if (response.error) {
//     return {
//       canSelect: false,
//       canInsert: false,
//       canUpdate: false,
//       canDelete: false,
//     };
//   }

//   const permissions = {
//     canSelect: false,
//     canInsert: false,
//     canUpdate: false,
//     canDelete: false,
//   };

//   response.data?.forEach((perm) => {
//     if (perm.permission === `${schema}.${id}:select`) {
//       permissions.canSelect = true;
//     } else if (perm.permission === `${schema}.${id}:insert`) {
//       permissions.canInsert = true;
//     } else if (perm.permission === `${schema}.${id}:update`) {
//       permissions.canUpdate = true;
//     } else if (perm.permission === `${schema}.${id}:delete`) {
//       permissions.canDelete = true;
//     }
//   });

//   return permissions;
// }

export function useResourcePermissions(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema> | DatabaseViews<typeof schema>,
) {
  return useQuery({
    queryKey: ["resource-permissions", schema, id],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();

      const response = await client
        .schema("supasheet")
        .from("role_permissions")
        .select()
        .in("permission", [
          `${schema}.${id}:select`,
          `${schema}.${id}:insert`,
          `${schema}.${id}:update`,
          `${schema}.${id}:delete`,
        ] as Database["supasheet"]["Enums"]["app_permission"][]);

      if (response.error) {
        return {
          canSelect: false,
          canInsert: false,
          canUpdate: false,
          canDelete: false,
        };
      }

      const permissions = {
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false,
      };

      response.data?.forEach((perm) => {
        if (perm.permission === `${schema}.${id}:select`) {
          permissions.canSelect = true;
        } else if (perm.permission === `${schema}.${id}:insert`) {
          permissions.canInsert = true;
        } else if (perm.permission === `${schema}.${id}:update`) {
          permissions.canUpdate = true;
        } else if (perm.permission === `${schema}.${id}:delete`) {
          permissions.canDelete = true;
        }
      });

      return permissions;
    },
    enabled: !!id,
  });
}
