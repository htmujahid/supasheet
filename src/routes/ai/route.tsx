import { Link, Outlet, createFileRoute } from "@tanstack/react-router"

import { ArrowLeftIcon, SparklesIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { pageTitle } from "#/lib/page-title"

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: pageTitle("AI") }] }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <SparklesIcon className="size-4" />
          </div>
          <span className="text-sm font-medium">AI</span>
        </div>
        <Button
          render={<Link to="/" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          <ArrowLeftIcon />
          Back to app
        </Button>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-4">
        <Outlet />
      </main>
    </div>
  )
}
