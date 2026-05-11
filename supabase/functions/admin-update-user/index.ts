import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  getCallerId,
  jsonResponse,
  requirePermission,
} from "../_shared/admin.ts"

const UPDATE_ALLOWED_FIELDS = [
  "email",
  "password",
  "email_confirm",
  "phone",
  "phone_confirm",
  "user_metadata",
  "ban_duration",
] as const

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const body = await req.json().catch(() => null)
  if (!body?.userId) return errorResponse("Missing userId", 400)

  const { userId } = body
  const attrs: Record<string, unknown> = {}
  for (const key of UPDATE_ALLOWED_FIELDS) {
    if (key in body) attrs[key] = body[key]
  }

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
  if (error) {
    console.error("admin-update-user", error)
    return errorResponse("Could not update user", 400)
  }

  return jsonResponse(data)
})
