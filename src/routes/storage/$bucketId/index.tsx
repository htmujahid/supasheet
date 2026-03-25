import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/storage/$bucketId/")({
  component: () => null,
})
