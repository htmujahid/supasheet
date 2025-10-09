export function ColorCell({
  value
}: {
  value: string
}) {
  return (
    <div className="size-4 rounded" style={{backgroundColor: value}}></div>
  )
}