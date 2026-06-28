import { createFileRoute } from "@tanstack/react-router"

import { SignUpForm } from "#/components/auth/sign-up-form"
import { pageTitle } from "#/lib/page-title"

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({ meta: [{ title: pageTitle("Sign Up") }] }),
  component: SignUpForm,
})
