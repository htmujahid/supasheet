import { Card, CardContent } from "#/components/ui/card"

export function ResultScalar({
  value,
  summary,
}: {
  value: string
  summary: string
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <span className="font-heading text-3xl font-semibold">{value}</span>
        <span className="text-sm text-muted-foreground">{summary}</span>
      </CardContent>
    </Card>
  )
}
