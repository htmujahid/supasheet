import { createFileRoute } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { SignInForm } from "#/components/auth/sign-in-form"

export const Route = createFileRoute("/auth/sign-in")({
  validateSearch: (search: { redirect?: string } & SearchSchemaInput) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign In | Supasheet" }] }),
  component: SignInForm,
})
