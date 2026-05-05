import { Card, CardContent } from "#/components/ui/card"

export function ResultText({ summary }: { summary: string }) {
  return (
    <Card size="sm">
      <CardContent className="text-sm whitespace-pre-wrap">
        {summary}
      </CardContent>
    </Card>
  )
}
