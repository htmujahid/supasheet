import { NextRequest, NextResponse } from "next/server";

import pathsConfig from "@/config/paths.config";
import { createAuthCallbackService } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export async function GET(request: NextRequest) {
  const service = createAuthCallbackService(await getSupabaseServerClient());

  const url = await service.verifyTokenHash(request, {
    redirectPath: pathsConfig.app.home,
  });

  return NextResponse.redirect(url);
}
