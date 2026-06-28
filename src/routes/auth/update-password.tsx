import { createFileRoute } from "@tanstack/react-router"

import { UpdatePasswordForm } from "#/components/auth/update-password-form"
import { pageTitle } from "#/lib/page-title"

export const Route = createFileRoute("/auth/update-password")({
  head: () => ({ meta: [{ title: pageTitle("Update Password") }] }),
  component: UpdatePasswordForm,
})
