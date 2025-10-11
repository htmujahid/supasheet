export function DurationCell({
  //value in milliseconds -> convert to readable format and return the value
  value,
}: {
  value: string;
}) {
  const milliseconds = parseInt(value, 10);
  if (isNaN(milliseconds)) {
    return null;
  }

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  if (parts.length === 0) {
    return <span>{milliseconds}ms</span>;
  }

  return <span>{parts.join(" ")}</span>;
}
