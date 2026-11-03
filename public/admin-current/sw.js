// Service worker mínimo: existe só para o painel ser instalável.
// Não guarda nada em cache: o painel mostra dados ao vivo e exige sessão.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
