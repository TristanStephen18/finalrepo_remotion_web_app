// hooks/useCollapsed.ts
import { useState } from "react";

export function useCollapsed(defaultValue = false) {
  const [collapsed, setCollapsed] = useState(defaultValue);
  return { collapsed, setCollapsed };
}
