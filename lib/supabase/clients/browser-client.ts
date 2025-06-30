import { createBrowserClient } from "@supabase/ssr";

import Cookie from "js-cookie";

import { Database } from "@/lib/database.types";

import {
  SUPABASE_ANON_KEY_COOKIE_NAME,
  SUPABASE_URL_COOKIE_NAME,
  getSupabaseClientKeys,
} from "../get-supabase-client-keys";

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export function getSupabaseBrowserClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();

  if (!keys.url) {
    const url = Cookie.get(SUPABASE_URL_COOKIE_NAME) as string;
    const anonKey = Cookie.get(SUPABASE_ANON_KEY_COOKIE_NAME) as string;

    keys.url = url;
    keys.anonKey = anonKey;
  }

  return createBrowserClient<GenericSchema>(keys.url, keys.anonKey);
}
