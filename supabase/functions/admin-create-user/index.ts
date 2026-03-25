import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  requirePermission,
} from "../_shared/admin.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const denied = await requirePermission(
    req.headers.get("Authorization"),
    "supasheet.users:insert"
  )
  if (denied) return denied

  const attrs = await req.json().catch(() => null)
  if (!attrs?.email) return errorResponse("Missing email", 400)

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.auth.admin.createUser(attrs)
  if (error) return errorResponse(error.message)

  return jsonResponse(data, 201)
})
