// utils/formatDate.ts
export function formatDateSafe(dateString?: string | null): string {
  if (!dateString) return "Click to preview or edit";

  // Replace the space with a "T" to make it ISO-compliant
  // Trim microseconds to 3 digits for JS compatibility
  let normalized = dateString
    .trim()
    .replace(" ", "T")
    .replace(/(\.\d{3})\d+$/, "$1"); // keep only 3 ms digits

  // If no timezone info, assume UTC
  if (!/[zZ]|[+\-]\d{2}:?\d{2}$/.test(normalized)) {
    normalized += "Z";
  }

  const parsed = new Date(normalized);
  if (isNaN(parsed.getTime())) return "Invalid date";

  // Return a nice formatted string
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
