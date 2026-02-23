export function formatDateSeparator(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return "Today";
  if (msgDate.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function shouldShowDateSeparator(
  messages: { timestamp?: number }[],
  index: number
): boolean {
  const current = messages[index]?.timestamp;
  if (!current) return false;
  if (index === 0) return true;
  const prev = messages[index - 1]?.timestamp;
  if (!prev) return true;
  const currDate = new Date(current).toDateString();
  const prevDate = new Date(prev).toDateString();
  return currDate !== prevDate;
}
