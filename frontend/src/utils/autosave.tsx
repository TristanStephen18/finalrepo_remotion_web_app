// utils/autosave.ts
export function saveStateToLocal(key: string, state: unknown) {
  localStorage.setItem(key, JSON.stringify(state));
}

export function loadStateFromLocal<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) as T : null;
}
