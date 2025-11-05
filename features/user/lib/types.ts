import { Database } from "@/lib/database.types";

export type Account = Database["supasheet"]["Tables"]["accounts"]["Row"];

// Extend Supabase User type with auth schema fields
declare module "@supabase/supabase-js" {
  interface User {
    banned_until?: string | null;
  }
}
