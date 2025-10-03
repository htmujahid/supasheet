import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

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
