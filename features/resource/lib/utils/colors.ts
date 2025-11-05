import { TEventColor } from "@/components/ui/event-calendar";

const colorMap = new Map<string, string>();
let colorIndex = 0;
const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "teal",
  "pink",
  "cyan",
  "lime",
];

export function stringToColor(str: string) {
  if (colorMap.has(str)) {
    return colorMap.get(str)! as TEventColor;
  }

  const color = colors[colorIndex % colors.length];
  colorMap.set(str, color);
  colorIndex += 1;
  return color as TEventColor;
}
