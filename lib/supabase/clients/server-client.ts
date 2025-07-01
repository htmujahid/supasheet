import "server-only";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { Database } from "@/lib/database.types";

import {
  SUPABASE_ANON_KEY_COOKIE_NAME,
  SUPABASE_URL_COOKIE_NAME,
  getSupabaseClientKeys,
} from "../get-supabase-client-keys";

/**
 * @name getSupabaseServerClient
 * @description Creates a Supabase client for use in the Server.
 */
export async function getSupabaseServerClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();

  if (!keys.url) {
    const cookieStore = await cookies();
    const url = cookieStore.get(SUPABASE_URL_COOKIE_NAME)?.value as string;
    const anonKey = cookieStore.get(SUPABASE_ANON_KEY_COOKIE_NAME)
      ?.value as string;

    keys.url = url;
    keys.anonKey = anonKey;
  }

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: {
      async getAll() {
        const cookieStore = await cookies();

        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        const cookieStore = await cookies();

        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
