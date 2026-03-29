import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
      localStorage.setItem(key, JSON.stringify(next));
      // Dispara el evento para que otras instancias se enteren
      window.dispatchEvent(
        new StorageEvent("storage", { key, newValue: JSON.stringify(next) }),
      );
      return next;
    });
  };

  // Escucha cambios de otras instancias
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [value, set] as const;
}
