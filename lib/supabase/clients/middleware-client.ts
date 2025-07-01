import "server-only";

import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { Database } from "@/lib/database.types";

import {
  SUPABASE_ANON_KEY_COOKIE_NAME,
  SUPABASE_URL_COOKIE_NAME,
  getSupabaseClientKeys,
} from "../get-supabase-client-keys";

/**
 * Creates a middleware client for Supabase.
 *
 * @param {NextRequest} request - The Next.js request object.
 * @param {NextResponse} response - The Next.js response object.
 */
export function createMiddlewareClient<GenericSchema = Database>(
  request: NextRequest,
  response: NextResponse,
) {
  const keys = getSupabaseClientKeys();

  if (!keys.url) {
    const url = request.cookies.get(SUPABASE_URL_COOKIE_NAME)?.value as string;
    const anonKey = request.cookies.get(SUPABASE_ANON_KEY_COOKIE_NAME)
      ?.value as string;

    keys.url = url;
    keys.anonKey = anonKey;
  }

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
}

export function checkSupabaseKeys(request: NextRequest) {
  const keys = getSupabaseClientKeys();

  if (!keys.url || !keys.anonKey) {
    const url = request.cookies.get(SUPABASE_URL_COOKIE_NAME)?.value as string;
    const anonKey = request.cookies.get(SUPABASE_ANON_KEY_COOKIE_NAME)
      ?.value as string;

    keys.url = url;
    keys.anonKey = anonKey;
  }

  if (!keys.url || !keys.anonKey) {
    return false;
  }

  return true;
}
