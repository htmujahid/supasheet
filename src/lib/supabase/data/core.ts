import { mutationOptions, queryOptions } from "@tanstack/react-query"

import type { ColumnFiltersState } from "@tanstack/react-table"

import type { Database } from "#/lib/database.types"

import { supabase } from "../client"
import { applyFilters } from "../filter"

export type AppRole = Database["supasheet"]["Enums"]["app_role"]
export type AppPermission = Database["supasheet"]["Enums"]["app_permission"]

export const auditLogsQueryOptions = (
  page: number,
  pageSize: number,
  sortId?: string,
  sortDesc?: boolean,
  filters: ColumnFiltersState = []
) =>
  queryOptions({
    queryKey: [
      "supasheet",
      "audit_logs",
      page,
      pageSize,
      sortId,
      sortDesc,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .schema("supasheet")
        .from("audit_logs")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (sortId) {
        query = query.order(sortId, { ascending: !sortDesc })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return {
        result: data,
        count: count,
        page: page,
        pageSize: pageSize,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

export const usersQueryOptions = (
  page: number,
  pageSize: number,
  sortId?: string,
  sortDesc?: boolean,
  filters: ColumnFiltersState = []
) =>
  queryOptions({
    queryKey: ["supasheet", "users", page, pageSize, sortId, sortDesc, filters],
    queryFn: async () => {
      let query = supabase
        .schema("supasheet")
        .from("users")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (sortId) {
        query = query.order(sortId, { ascending: !sortDesc })
      }

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return {
        result: data,
        count: count,
        page: page,
        pageSize: pageSize,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

export const allUsersQueryOptions = queryOptions({
  queryKey: ["supasheet", "users", "all"],
  queryFn: async () => {
    const { data, error } = await supabase
      .schema("supasheet")
      .from("users")
      .select("id, name, email")
      .order("name", { ascending: true })

    if (error) throw error
    return data
  },
  staleTime: 1000 * 60 * 5,
})

export const rolesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["supasheet", "roles", userId],
    queryFn: async () => {
      const { data: userRoles, error: rolesError } = await supabase
        .schema("supasheet")
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)

      if (rolesError) throw rolesError

      const roles = userRoles
      if (roles.length === 0) return []

      const { data: rolePermissions, error: permissionsError } = await supabase
        .schema("supasheet")
        .from("role_permissions")
        .select("*")
        .in(
          "role",
          roles.map((r) => r.role)
        )

      if (permissionsError) throw permissionsError

      return roles.map((userRole) => ({
        ...userRole,
        permissions: rolePermissions.filter((rp) => rp.role === userRole.role),
      }))
    },
    staleTime: 1000 * 60 * 5,
  })

export const userRolesQueryOptions = (
  page: number,
  pageSize: number,
  sortId?: string,
  sortDesc?: boolean,
  filters: ColumnFiltersState = []
) =>
  queryOptions({
    queryKey: [
      "supasheet",
      "user_roles",
      page,
      pageSize,
      sortId,
      sortDesc,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .schema("supasheet")
        .from("user_roles")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (sortId) {
        query = query.order(sortId, { ascending: !sortDesc })
      } else {
        query = query.order("id", { ascending: true })
      }

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return { result: data, count, page, pageSize }
    },
    staleTime: 1000 * 60 * 5,
  })

export const rolePermissionsQueryOptions = (
  page: number,
  pageSize: number,
  sortId?: string,
  sortDesc?: boolean,
  filters: ColumnFiltersState = []
) =>
  queryOptions({
    queryKey: [
      "supasheet",
      "role_permissions",
      page,
      pageSize,
      sortId,
      sortDesc,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .schema("supasheet")
        .from("role_permissions")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (sortId) {
        query = query.order(sortId, { ascending: !sortDesc })
      } else {
        query = query.order("id", { ascending: true })
      }

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return { result: data, count, page, pageSize }
    },
    staleTime: 1000 * 60 * 5,
  })

export const createUserRoleMutationOptions = mutationOptions({
  mutationFn: async (data: { user_id: string; role: AppRole }) => {
    const { error } = await supabase
      .schema("supasheet")
      .from("user_roles")
      .insert({ user_id: data.user_id, role: data.role })
    if (error) throw error
  },
})

export const createRolePermissionMutationOptions = mutationOptions({
  mutationFn: async (data: { role: AppRole; permission: AppPermission }) => {
    const { error } = await supabase
      .schema("supasheet")
      .from("role_permissions")
      .insert(data)
    if (error) throw error
  },
})

export const deleteUserRolesMutationOptions = mutationOptions({
  mutationFn: async (ids: number[]) => {
    const { error } = await supabase
      .schema("supasheet")
      .from("user_roles")
      .delete()
      .in("id", ids)
    if (error) throw error
  },
})

export const deleteRolePermissionsMutationOptions = mutationOptions({
  mutationFn: async (ids: number[]) => {
    const { error } = await supabase
      .schema("supasheet")
      .from("role_permissions")
      .delete()
      .in("id", ids)
    if (error) throw error
  },
})

export const userRoleQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["supasheet", "user_roles", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .from("user_roles")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })

export const rolePermissionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["supasheet", "role_permissions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .from("role_permissions")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })

export const auditLogQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["supasheet", "audit_logs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .from("audit_logs")
        .select("*")
        .eq("id", id)
        .maybeSingle()
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })

export const deleteAccountsMutationOptions = mutationOptions({
  mutationFn: async (ids: string[]) => {
    const { error } = await supabase
      .schema("supasheet")
      .from("users")
      .delete()
      .in("id", ids)
    if (error) throw error
  },
})

export const userPermissionsQueryOptions = (schema?: string) =>
  queryOptions({
    queryKey: ["supasheet", "permissions", schema ?? null],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_permissions", { schema_name: schema })
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })
