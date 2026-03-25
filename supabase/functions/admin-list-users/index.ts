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
    "supasheet.users:select"
  )
  if (denied) return denied

  const { page = 1, perPage = 50 } = await req.json().catch(() => ({}))

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.auth.admin.listUsers({
    page,
    perPage,
  })
  if (error) return errorResponse(error.message)

  return jsonResponse(data)
})
