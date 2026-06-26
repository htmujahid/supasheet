import { createClient } from "@supabase/supabase-js"

import type { Database } from "../database.types"

declare global {
  interface Window {
    __CONFIG__?: { supabaseUrl: string; anonKey: string }
  }
}

const config = typeof window !== "undefined" ? window.__CONFIG__ : undefined

export const supabase = createClient<Database>(
  localStorage.getItem("supabase-url") ??
    config?.supabaseUrl ??
    import.meta.env.VITE_SUPABASE_URL,
  localStorage.getItem("supabase-pubkey") ??
    config?.anonKey ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
