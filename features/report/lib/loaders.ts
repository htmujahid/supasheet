import { DatabaseTables } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import { ReportSearchParams } from "./validations";

export async function loadReportGroups() {
  const client = await getSupabaseServerClient();

  const reportGroups = await client
    .schema("supasheet")
    .rpc("get_report_groups");

  if (reportGroups.error) {
    return null;
  }

  return reportGroups.data;
}

export async function loadReports(group: string) {
  const client = await getSupabaseServerClient();

  const reports = await client
    .schema("supasheet")
    .rpc("get_reports", { p_group: group });

  if (reports.error) {
    return null;
  }

  return reports.data;
}

export async function loadColumnsSchema(id: string) {
  const client = await getSupabaseServerClient();

  const columnResponse = await client
    .schema("supasheet")
    .rpc("get_columns", { table_name: id });

  return columnResponse.data;
}

export async function loadReportData(
  id: DatabaseTables<"reports">,
  input: ReportSearchParams,
) {
  const client = await getSupabaseServerClient();

  const { page, perPage, sort, filters, joinOperator } = input;

  const query = client
    .schema("reports")
    .from(id)
    .select("*", { count: "exact" })
    .range((page - 1) * perPage, page * perPage - 1);

  sort.forEach((item) => {
    query.order(item.id, { ascending: item.desc });
  });

  if (joinOperator === "or" && filters.length > 0) {
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
  } else {
    filters.forEach((filter) => {
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
          query.in(filter.id, filter.value as string[]);
        } else if (filter.operator === "not.in") {
          query.not("status", "in", filter.value as string[]);
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

  const response = await query;

  const total = response.count;

  return {
    results: response.data ?? [],
    total: total ?? 0,
    page: Number(page),
    perPage: Number(perPage),
  };
}
