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
    keys.url = Cookie.get(SUPABASE_URL_COOKIE_NAME) || "http://127.0.0.1:54321";
    keys.anonKey =
      Cookie.get(SUPABASE_ANON_KEY_COOKIE_NAME) ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
  }

  return createBrowserClient<GenericSchema>(keys.url, keys.anonKey);
}
