import { useLocation } from "@tanstack/react-router"

const SUPPORTED_VIEW_RE =
  /\/(table|grid|kanban\/[^/]+|calendar\/[^/]+|gallery\/[^/]+|list\/[^/]+|[^/]+\/detail)$/

export type DrawerLink = {
  to: string
  search: Record<string, unknown>
}

export function useDrawerHref(
  search: Record<string, unknown>
): DrawerLink | null {
  const { pathname } = useLocation()
  if (!SUPPORTED_VIEW_RE.test(pathname)) return null
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined) continue
    cleaned[key] = value
  }
  return { to: `${pathname}/drawer`, search: cleaned }
}
