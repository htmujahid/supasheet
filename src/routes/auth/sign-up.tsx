import { createFileRoute } from "@tanstack/react-router"

import { SignUpForm } from "#/components/auth/sign-up-form"

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({ meta: [{ title: "Sign Up | Supasheet" }] }),
  component: SignUpForm,
})
