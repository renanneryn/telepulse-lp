import { useCallback, useEffect, useState } from "react";

/**
 * Estado que sobrevive a reload e a troca de aba, guardado no localStorage.
 *
 * Serve pras preferencias de interface do painel — ordenacao, filtro escolhido,
 * aba aberta. O admin organiza a tela do jeito dele e encontra tudo igual da
 * proxima vez, em vez de refazer o mesmo caminho a cada visita.
 *
 * Tudo e try/catch porque localStorage lanca em janela anonima, com cookies de
 * site bloqueados e em captura de thumbnail — nesses casos a preferencia
 * simplesmente nao persiste, mas a tela continua funcionando com o default.
 */
export function usePref<T>(key: string, initial: T) {
  const storageKey = `tlp:pref:${key}`;

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* sem persistencia: segue com o valor em memoria */
    }
  }, [storageKey, value]);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* idem */
    }
    setValue(initial);
  }, [storageKey, initial]);

  return [value, setValue, reset] as const;
}
