import { createClient } from "@supabase/supabase-js"

import type { Database } from "../database.types"

export const supabase = createClient<Database>(
  localStorage.getItem("supabase-url") ?? import.meta.env.VITE_SUPABASE_URL,
  localStorage.getItem("supabase-pubkey") ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
