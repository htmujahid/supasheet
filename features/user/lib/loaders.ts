import { getSupabaseServerAdminClient } from "@/lib/supabase/clients/server-admin-client";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import { UsersSearchParams } from "./validations";

export async function loadAccounts(input: UsersSearchParams) {
  const client = getSupabaseServerAdminClient();

  const { page, perPage, sort, filters, joinOperator } = input;

  const query = client
    .schema("supasheet")
    .from("accounts")
    .select("*", { count: "exact" })
    .range((page - 1) * perPage, page * perPage - 1);

  sort.forEach((item) => {
    query.order(item.id, { ascending: !item.desc });
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

  const response = await query;

  const total = response.count;

  return {
    results: response.data ?? [],
    total: total ?? 0,
    page: Number(page),
    perPage: Number(perPage),
  };
}

export async function loadSingleUser(id: string) {
  const client = getSupabaseServerAdminClient();

  const response = await client.auth.admin.getUserById(id);

  if (response.error) {
    return null;
  }

  return response.data.user;
}

export async function loadRolesPermissions() {
  const client = await getSupabaseServerClient();

  const { data, error } = await client
    .schema("supasheet")
    .from(`user_roles`)
    .select("*");

  const { data: rolePermissionsData, error: rolePermissionsError } =
    await client.schema("supasheet").from(`role_permissions`).select("*");

  if (rolePermissionsError) {
    console.error("Error loading role permissions:", rolePermissionsError);
    return [];
  }

  if (error) {
    console.error("Error loading user roles:", error);
    return [];
  }

  return (
    data?.map((userRole) => {
      const permissions =
        rolePermissionsData?.filter((rp) => rp.role === userRole.role) || [];
      return {
        ...userRole,
        permissions,
      };
    }) || []
  );
}

export async function loadAccountPermissions() {
  const client = await getSupabaseServerClient();

  const response = await client
    .schema("supasheet")
    .from("role_permissions")
    .select()
    .in("permission", [
      'supasheet.accounts:select',
      'supasheet.accounts:insert',
      'supasheet.accounts:update',
      'supasheet.accounts:delete',
    ]);

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
    if (perm.permission === "supasheet.accounts:select") {
      permissions.canSelect = true;
    } else if (perm.permission === "supasheet.accounts:insert") {
      permissions.canInsert = true;
    } else if (perm.permission === "supasheet.accounts:update") {
      permissions.canUpdate = true;
    } else if (perm.permission === "supasheet.accounts:delete") {
      permissions.canDelete = true;
    }
  });

  return permissions;
}