import { createFileRoute } from "@tanstack/react-router"

import { SignInForm } from "#/components/auth/sign-in-form"

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({ meta: [{ title: "Sign In | Supasheet" }] }),
  component: SignInForm,
})
