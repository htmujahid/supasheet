import { getRouteApi } from "@tanstack/react-router"

export function useAuthUser() {
  const context = getRouteApi("__root__").useRouteContext()
  return context.authUser
}

export function useUser() {
  const context = getRouteApi("__root__").useRouteContext()
  return context.user
}
