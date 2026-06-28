import { createFileRoute } from "@tanstack/react-router"

import { ForgotPasswordForm } from "#/components/auth/forgot-password-form"
import { pageTitle } from "#/lib/page-title"

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: pageTitle("Forgot Password") }] }),
  component: ForgotPasswordForm,
})
