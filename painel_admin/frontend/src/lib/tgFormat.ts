/**
 * Preview da mensagem do broadcast como o Telegram renderiza.
 * Escapa TUDO primeiro e só devolve o subconjunto de formatação que o Telegram
 * aceita — o texto digitado nunca vira HTML arbitrário no painel.
 */
export type ParseMode = "html" | "markdown";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function renderTelegramPreview(text: string, mode: ParseMode): string {
  let h = esc(text);
  if (mode === "html") {
    h = h
      .replace(/&lt;(\/?)(b|strong|i|em|u|ins|s|strike|del|code|pre)&gt;/gi, "<$1$2>")
      .replace(/&lt;a\s+href=&quot;(https?:\/\/[^"<>\s&]+(?:&amp;[^"<>\s&]+)*)&quot;&gt;/gi, '<a href="$1" target="_blank" rel="noreferrer">')
      .replace(/&lt;\/a&gt;/gi, "</a>");
  } else {
    h = h
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(/\*\*([\s\S]+?)\*\*/g, "<b>$1</b>")
      .replace(/__([\s\S]+?)__/g, "<i>$1</i>")
      .replace(/~~([\s\S]+?)~~/g, "<s>$1</s>")
      .replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  }
  return h;
}

/** Marcação de cada botão da barra de formatação, por parse_mode. */
export const FORMAT_TOOLS: Record<
  ParseMode,
  { id: string; label: string; title: string; open: string; close: string; sample: string }[]
> = {
  html: [
    { id: "b", label: "B", title: "Negrito", open: "<b>", close: "</b>", sample: "negrito" },
    { id: "i", label: "I", title: "Itálico", open: "<i>", close: "</i>", sample: "itálico" },
    { id: "u", label: "U", title: "Sublinhado", open: "<u>", close: "</u>", sample: "sublinhado" },
    { id: "s", label: "S", title: "Riscado", open: "<s>", close: "</s>", sample: "riscado" },
    { id: "c", label: "</>", title: "Código", open: "<code>", close: "</code>", sample: "código" },
    { id: "a", label: "🔗", title: "Link", open: '<a href="https://">', close: "</a>", sample: "texto do link" },
  ],
  markdown: [
    { id: "b", label: "B", title: "Negrito", open: "**", close: "**", sample: "negrito" },
    { id: "i", label: "I", title: "Itálico", open: "__", close: "__", sample: "itálico" },
    { id: "s", label: "S", title: "Riscado", open: "~~", close: "~~", sample: "riscado" },
    { id: "c", label: "</>", title: "Código", open: "`", close: "`", sample: "código" },
    { id: "a", label: "🔗", title: "Link", open: "[", close: "](https://)", sample: "texto do link" },
  ],
};
