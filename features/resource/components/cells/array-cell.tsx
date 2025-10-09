import { Badge } from "@/components/ui/badge"

export function ArrayCell({
  value
}: {
  value: string[] | null
}) {
  return (
    <div className="flex gap-1">
      {value?.map((v) => (<Badge key={v} variant={"outline"}>{v.toString()}</Badge>))}
    </div>
  )
}