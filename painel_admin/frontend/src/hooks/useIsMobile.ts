import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 640px)";

/**
 * `true` quando a viewport é de celular.
 *
 * useSyncExternalStore em vez de useState+useEffect: evita o flash de um
 * primeiro render "desktop" antes do efeito rodar, e acompanha rotação de
 * tela sem listener manual.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false, // build/SSR: assume desktop
  );
}
