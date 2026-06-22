export function formatClockTime(
  value: string,
  { withSeconds = false }: { withSeconds?: boolean } = {},
) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hourCycle: "h23",
  });
}
