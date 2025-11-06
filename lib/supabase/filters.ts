import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { ClientServerOptions } from "@supabase/supabase-js/dist/module/lib/rest/types/common/common";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

import { TableMetadata } from "../database-meta.types";

type FilterArray = Required<TableMetadata>["query"]["filter"];

/**
 * Apply AND filters to a Supabase query
 * Filters are applied as separate conditions, all must match
 */
export function applyAndFilters<
  ClientOptions extends ClientServerOptions,
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  Result,
  RelationName = unknown,
  Relationships = unknown,
  Method = unknown,
>(
  query: PostgrestFilterBuilder<
    ClientOptions,
    Schema,
    Row,
    Result,
    RelationName,
    Relationships,
    Method
  >,
  filters: FilterArray,
) {
  filters?.forEach((filter) => {
    if (filter.operator === "empty") {
      query.filter(filter.id, "is", null);
      return;
    } else if (filter.operator === "not.empty") {
      query.filter(filter.id, "not.is", null);
      return;
    }

    if (filter.variant === "date") {
      if (filter.operator === "between") {
        const startDate = new Date();
        const endDate = new Date();

        startDate.setTime(Number(filter.value[0]));
        endDate.setTime(Number(filter.value[1]));

        query
          .gte(filter.id, startDate.toISOString())
          .lte(filter.id, endDate.toISOString());
      } else {
        const date = new Date();
        date.setTime(Number(filter.value));

        query.filter(filter.id, filter.operator, date.toISOString());
      }
    } else if (filter.variant === "text") {
      if (filter.operator === "ilike") {
        query.ilike(filter.id, `%${filter.value}%`);
      } else if (filter.operator === "not.ilike") {
        query.not(filter.id, "ilike", `%${filter.value}%`);
      } else {
        query.filter(filter.id, filter.operator, filter.value);
      }
    } else {
      if (filter.operator === "in") {
        query.in(filter.id as never, filter.value as string[]);
      } else if (filter.operator === "not.in") {
        query.not(filter.id, "in", filter.value as string[]);
      } else if (filter.operator === "between") {
        query
          .gte(filter.id, filter.value[0] as string)
          .lte(filter.id, filter.value[1] as string);
      } else {
        query.filter(filter.id, filter.operator, filter.value);
      }
    }
  });
}

/**
 * Apply OR filters to a Supabase query
 * Filters are combined as OR conditions, at least one must match
 */
export function applyOrFilters<
  ClientOptions extends ClientServerOptions,
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  Result,
  RelationName = unknown,
  Relationships = unknown,
  Method = unknown,
>(
  query: PostgrestFilterBuilder<
    ClientOptions,
    Schema,
    Row,
    Result,
    RelationName,
    Relationships,
    Method
  >,
  filters: FilterArray,
) {
  if (!filters || filters.length === 0) {
    return;
  }

  const orConditions: string[] = [];

  filters.forEach((filter) => {
    if (filter.operator === "empty") {
      orConditions.push(`${filter.id}.is.null`);
    } else if (filter.operator === "not.empty") {
      orConditions.push(`${filter.id}.not.is.null`);
    } else if (filter.variant === "date") {
      if (filter.operator === "between") {
        const startDate = new Date();
        const endDate = new Date();
        startDate.setTime(Number(filter.value[0]));
        endDate.setTime(Number(filter.value[1]));
        orConditions.push(
          `${filter.id}.gte.${startDate.toISOString()},${filter.id}.lte.${endDate.toISOString()}`,
        );
      } else {
        const date = new Date();
        date.setTime(Number(filter.value));
        orConditions.push(
          `${filter.id}.${filter.operator}.${date.toISOString()}`,
        );
      }
    } else if (filter.variant === "text") {
      if (filter.operator === "ilike") {
        orConditions.push(`${filter.id}.ilike.%${filter.value}%`);
      } else if (filter.operator === "not.ilike") {
        orConditions.push(`${filter.id}.not.ilike.%${filter.value}%`);
      } else {
        orConditions.push(`${filter.id}.${filter.operator}.${filter.value}`);
      }
    } else {
      if (filter.operator === "in") {
        const values = (filter.value as string[]).join(",");
        orConditions.push(`${filter.id}.in.(${values})`);
      } else if (filter.operator === "not.in") {
        const values = (filter.value as string[]).join(",");
        orConditions.push(`${filter.id}.not.in.(${values})`);
      } else if (filter.operator === "between") {
        orConditions.push(
          `${filter.id}.gte.${filter.value[0]},${filter.id}.lte.${filter.value[1]}`,
        );
      } else {
        orConditions.push(`${filter.id}.${filter.operator}.${filter.value}`);
      }
    }
  });

  if (orConditions.length > 0) {
    query.or(orConditions.join(","));
  }
}
