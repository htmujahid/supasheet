import { createFileRoute } from "@tanstack/react-router"

import { UpdatePasswordForm } from "#/components/auth/update-password-form"

export const Route = createFileRoute("/auth/update-password")({
  head: () => ({ meta: [{ title: "Update Password | Supasheet" }] }),
  component: UpdatePasswordForm,
})
