import { createFileRoute } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Spinner } from "#/components/ui/spinner"

export const Route = createFileRoute("/init")({
  validateSearch: (
    search: {
      "supabase-url"?: string
      "supabase-pubkey"?: string
    } & SearchSchemaInput
  ) => ({
    "supabase-url":
      typeof search["supabase-url"] === "string"
        ? search["supabase-url"]
        : undefined,
    "supabase-pubkey":
      typeof search["supabase-pubkey"] === "string"
        ? search["supabase-pubkey"]
        : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const url = search["supabase-url"]
    const pubkey = search["supabase-pubkey"]

    if (!url || !pubkey) {
      throw new Error(
        "Missing required params: supabase-url and supabase-pubkey must be provided as search params."
      )
    }

    if (!/^https?:\/\/.+/.test(url)) {
      throw new Error(
        "Invalid supabase-url: must be a valid URL starting with http:// or https://"
      )
    }

    localStorage.setItem("supabase-url", url)
    localStorage.setItem("supabase-pubkey", pubkey)

    window.location.href = "/"
    await new Promise<never>(() => {})
  },
  pendingMs: 0,
  pendingComponent: InitPending,
  errorComponent: InitError,
  component: () => null,
})

function InitPending() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Spinner className="size-6" />
      <p className="text-sm font-medium">Initializing Supasheet</p>
      <p className="text-xs text-muted-foreground">
        Please wait while we configure your connection...
      </p>
    </div>
  )
}

function InitError({ error }: { error: Error }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        {error?.message ?? "An unexpected error occurred."}
      </p>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go back
      </Button>
    </div>
  )
}
