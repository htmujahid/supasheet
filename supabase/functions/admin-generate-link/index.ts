import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  requirePermission,
} from "../_shared/admin.ts"

// Valid link types from the Supabase admin API
type LinkType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change_current"
  | "email_change_new"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const denied = await requirePermission(
    req.headers.get("Authorization"),
    "supasheet.users:generate_link"
  )
  if (denied) return denied

  const params = await req.json().catch(() => null)
  if (!params?.type || !params?.email) {
    return errorResponse("Missing required fields: type, email", 400)
  }

  const validTypes: LinkType[] = [
    "signup",
    "invite",
    "magiclink",
    "recovery",
    "email_change_current",
    "email_change_new",
  ]
  if (!validTypes.includes(params.type as LinkType)) {
    return errorResponse(
      `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      400
    )
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.auth.admin.generateLink(params)
  if (error) return errorResponse(error.message)

  return jsonResponse(data, 201)
})
