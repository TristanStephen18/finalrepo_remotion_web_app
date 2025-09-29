export function detectFileType(file: File): "json" | "xlsx" | "unknown" {
    const mime = file.type;
    if (mime === "application/json" || file.name.endsWith(".json")) return "json";
    if (
      mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.endsWith(".xlsx")
    ) return "xlsx";
    return "unknown";
  }