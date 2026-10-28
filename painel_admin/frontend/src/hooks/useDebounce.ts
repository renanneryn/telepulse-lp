import { useEffect, useState } from "react";

/**
 * Debounce genérico — retorna `value` só depois que ele fica estável por
 * `delayMs`. Usado para não spammar requests a cada tecla digitada.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
