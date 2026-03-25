import { queryOptions } from "@tanstack/react-query"

import { supabase } from "#/lib/supabase/client"

export const authUserQueryOptions = queryOptions({
  queryKey: ["auth", "user"],
  queryFn: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user ?? null
  },
  staleTime: 1000 * 60 * 5,
})
