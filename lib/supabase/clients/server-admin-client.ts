import "server-only";

import { createClient } from "@supabase/supabase-js";

import { Database } from "@/lib/database.types";

import {
  getServiceRoleKey,
  warnServiceRoleKeyUsage,
} from "../get-service-role-key";
import { getSupabaseClientKeys } from "../get-supabase-client-keys";

/**
 * @name getSupabaseServerAdminClient
 * @description Get a Supabase client for use in the Server with admin access to the database.
 */
export function getSupabaseServerAdminClient<GenericSchema = Database>() {
  warnServiceRoleKeyUsage();

  const url = getSupabaseClientKeys().url;

  return createClient<GenericSchema>(url, getServiceRoleKey(), {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
}
