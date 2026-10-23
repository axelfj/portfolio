export function formatWorkDate(input: Date | string) {
  if (typeof input === "string") return input
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(input)
}
