export function readField(
  data: Record<string, unknown>,
  path?: string
): string | null {
  if (!path) return null
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      data
    )
  return value == null ? null : String(value)
}
