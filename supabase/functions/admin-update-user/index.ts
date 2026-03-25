import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  getCallerId,
  jsonResponse,
  requirePermission,
} from "../_shared/admin.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const body = await req.json().catch(() => null)
  if (!body?.userId) return errorResponse("Missing userId", 400)

  const { userId, ...attrs } = body

  const callerId = await getCallerId(req.headers.get("Authorization"))
  if (callerId === userId)
    return errorResponse(
      "Cannot modify your own account via this endpoint",
      403
    )

  // Ban/unban uses ban_duration — requires a separate permission
  const permission =
    "ban_duration" in attrs ? "supasheet.users:ban" : "supasheet.users:update"

  const denied = await requirePermission(
    req.headers.get("Authorization"),
    permission
  )
  if (denied) return denied

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.auth.admin.updateUserById(
    userId,
    attrs
  )
  if (error) return errorResponse(error.message)

  return jsonResponse(data)
})
