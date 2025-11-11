import { useQuery } from "@tanstack/react-query";

import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

export function useCurrentUserRoles() {
  const client = useSupabase();
  const queryKey = ["user:current-roles"];

  const queryFn = async () => {
    const response = await client
      .schema("supasheet")
      .from("user_roles")
      .select("*");

    if (response.error) {
      throw response.error;
    }

    return response.data || [];
  };

  return useQuery({
    queryKey,
    queryFn,
  });
}
