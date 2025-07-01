import { z } from "zod";

/**
 * Returns and validates the Supabase client keys from the environment.
 */
export function getSupabaseClientKeys() {
  return z
    .object({
      url: z.string().default(""),
      anonKey: z.string().default(""),
    })
    .parse({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
}

export const SUPABASE_URL_COOKIE_NAME = "supabase-url";
export const SUPABASE_ANON_KEY_COOKIE_NAME = "supabase-anon-key";
