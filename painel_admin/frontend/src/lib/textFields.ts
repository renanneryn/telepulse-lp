/**
 * Textos e botões do bot editáveis na tela Textos, organizados pela parte do
 * bot em que aparecem. Fonte única: a tela de Settings esconde estas chaves.
 */
export type TextField = {
  key: string;
  label: string;
  group: string;
  multiline: boolean; // false = nome de botão
  hint?: string;
  requires?: string[]; // placeholders obrigatórios
  vars?: string[]; // placeholders que o bot troca (botões de inserir)
};

export type TextGroup = { id: string; title: string; desc: string };

export const TEXT_GROUPS: TextGroup[] = [
  { id: "inicio", title: "Início e conexão", desc: "O que o usuário vê no /start e logo depois de conectar a conta" },
  { id: "ajuda", title: "Ajuda e informações", desc: "Explicações sobre o bot e como usar cada função" },
  { id: "clone", title: "Clone", desc: "Menu, ajuda e botões do clone, e os avisos do clone de teste" },
  { id: "encaminhar", title: "Encaminhamentos e Regras de Texto", desc: "Menus do Tempo Real e das Regras de Texto" },
  { id: "planos", title: "Bloqueios e planos", desc: "Avisos de bot trancado, recurso exclusivo VIP e teste grátis" },
  { id: "navegacao", title: "Navegação", desc: "Botões usados em várias telas" },
];

export const TEXT_FIELDS: TextField[] = [
  // Início e conexão
  { key: "welcome_text", label: "Boas-vindas (/start sem conta conectada)", group: "inicio", multiline: true },
  { key: "start_text", label: "Painel com conta conectada", group: "inicio", multiline: true,
    hint: "Só vale com \"Usar este texto\" ligado; desligado, o bot monta o painel sozinho.",
    vars: ["{name}", "{user_id}", "{phone}", "{total_clones}", "{active_forwards}"] },
  { key: "first_steps_text", label: "Primeiros passos (logo após conectar)", group: "inicio", multiline: true },
  // Ajuda e informações
  { key: "info_text", label: "Como o bot funciona (Sobre)", group: "ajuda", multiline: true },
  { key: "guia_funcoes_text", label: "Guia: Qual função usar?", group: "ajuda", multiline: true },
  { key: "howto_channel_id_text", label: "Como pegar o ID de um canal", group: "ajuda", multiline: true },
  // Clone
  { key: "clone_menu_text", label: "Menu de Clone", group: "clone", multiline: true },
  { key: "clone_help_text", label: "Ajuda detalhada do /clone", group: "clone", multiline: true },
  { key: "btn_clone", label: "Botão: Clonar", group: "clone", multiline: false },
  { key: "btn_clone_active", label: "Botão: Clone em andamento", group: "clone", multiline: false },
  { key: "btn_history", label: "Botão: Histórico", group: "clone", multiline: false },
  { key: "priv_clone_taste_done_text", label: "Clone de teste grátis concluído", group: "clone", multiline: true,
    vars: ["{src}"] },
  { key: "priv_clone_taste_used_text", label: "Clone de teste grátis já usado", group: "clone", multiline: true },
  { key: "tester_clone_block_text", label: "Clone bloqueado no teste grátis", group: "clone", multiline: true },
  // Encaminhamentos e Regras de Texto
  { key: "forward_menu_text", label: "Menu de Tempo Real", group: "encaminhar", multiline: true },
  { key: "replace_menu_text", label: "Menu de Regras de Texto", group: "encaminhar", multiline: true },
  { key: "btn_replace", label: "Botão: Regras de Texto", group: "encaminhar", multiline: false },
  // Bloqueios e planos
  { key: "trial_banner_text", label: "Teste grátis liberado", group: "planos", multiline: true,
    requires: ["{dias}"], vars: ["{dias}"] },
  { key: "lockdown_block_text", label: "Bot trancado (só assinantes)", group: "planos", multiline: true },
  { key: "paid_block_text", label: "Recurso exclusivo VIP", group: "planos", multiline: true,
    requires: ["{recurso}"], vars: ["{recurso}", "{whatsapp}"] },
  // Navegação
  { key: "btn_back", label: "Botão: Voltar", group: "navegacao", multiline: false },
];

/** Configs que vivem junto dos textos (não aparecem em Settings). */
export const TEXT_SETTING_KEYS = new Set<string>([...TEXT_FIELDS.map((f) => f.key), "start_text_mode"]);

/** Valores de exemplo para a prévia. */
export const SAMPLE_VARS: Record<string, string> = {
  "{name}": "Fulano",
  "{user_id}": "123456789",
  "{phone}": "+55 11 99999-0000",
  "{total_clones}": "3",
  "{active_forwards}": "2",
  "{dias}": "7",
  "{recurso}": "Clone de tópicos de supergrupo",
  "{whatsapp}": "wa.me/5500000000000",
  "{src}": "Canal Exemplo",
};
