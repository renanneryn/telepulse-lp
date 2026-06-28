import React from "react";

export type Lang = "pt" | "en";

export const COPY: Record<Lang, {
  metaTitle: string;
  navBenefits: string;
  navUseCases: string;
  navHowItWorks: string;
  navFaq: string;
  startNow: string;
  startFree: string;
  contact: string;
  backHome: string;
  dashboardTitle: string;
  dashboardIntro: string;
  dashboardStep1: string;
  dashboardStep1Text: string;
  openBot: string;
  dashboardStep2: string;
  dashboardStep2Text: string;
  heroLead: string;
  heroAccent: string;
  heroSecond: string;
  phrases: string[];
}> = {
  pt: {
    metaTitle: "TelePulse - Automação Inteligente para Telegram",
    navBenefits: "Benefícios",
    navUseCases: "Casos de Uso",
    navHowItWorks: "Como Funciona",
    navFaq: "FAQ",
    startNow: "Começar Agora",
    startFree: "Começar Agora de Graça",
    contact: "Entrar em Contato",
    backHome: "Voltar para Home",
    dashboardTitle: "Conectar Telegram",
    dashboardIntro: "Para começar a automatizar, precisamos conectar sua conta. Siga as instruções no nosso bot oficial.",
    dashboardStep1: "Acesse o Bot",
    dashboardStep1Text: "Clique no botão abaixo para abrir o bot no Telegram e obter seu código de acesso.",
    openBot: "Abrir @tele_pulsebot",
    dashboardStep2: "Configurar Tarefas",
    dashboardStep2Text: "Após conectar, você poderá criar tarefas de encaminhamento e clonagem diretamente por aqui ou pelo bot.",
    heroLead: "Escala ",
    heroAccent: "Total",
    heroSecond: "Automatize Canais e Grupos",
    phrases: [
      "Transforme conteúdos e troque links automaticamente em tempo real.",
      "Copie sinais, ofertas ou conteúdos entre Canais e Grupos com perfeição.",
      "Gerencie dezenas de Canais e Grupos sem precisar de uma equipe.",
      "Monitore, filtre, transforme e encaminhe mensagens automaticamente com suas próprias tarefas. Nunca mais perca o que é importante.",
    ],
  },
  en: {
    metaTitle: "TelePulse - Smart Telegram Automation",
    navBenefits: "Benefits",
    navUseCases: "Use Cases",
    navHowItWorks: "How It Works",
    navFaq: "FAQ",
    startNow: "Start Now",
    startFree: "Start Free",
    contact: "Contact Us",
    backHome: "Back to Home",
    dashboardTitle: "Connect Telegram",
    dashboardIntro: "To start automating, connect your account and follow the instructions in our official bot.",
    dashboardStep1: "Open the Bot",
    dashboardStep1Text: "Click the button below to open the Telegram bot and get your access code.",
    openBot: "Open @tele_pulsebot",
    dashboardStep2: "Configure Tasks",
    dashboardStep2Text: "After connecting, you can create forwarding and cloning tasks here or directly inside the bot.",
    heroLead: "Scale ",
    heroAccent: "Everything",
    heroSecond: "Automate Channels and Groups",
    phrases: [
      "Transform content and replace links automatically in real time.",
      "Copy signals, offers, and content between Channels and Groups with precision.",
      "Manage dozens of Channels and Groups without hiring a team.",
      "Monitor, filter, transform, and forward messages automatically with your own tasks. Never miss what matters again.",
    ],
  },
};

const EN_TRANSLATIONS: Record<string, string> = {
  "O que você enfrenta hoje": "What you deal with today",
  "Você fica preso ao encaminhamento manual padrão": "You are stuck with standard manual forwarding",
  "É impossível trocar links das mensagens, limpar nomes e substituir textos automaticamente": "Replacing message links, cleaning names, and swapping text automatically becomes impossible",
  "Você não consegue adicionar botões clicáveis de venda nas postagens que recebe": "You cannot add clickable sales buttons to the posts you receive",
  "Perde de tempo total organizando canais e grupos de forma manual": "You waste a huge amount of time organizing channels and groups manually",
  "Sua nova realidade": "Your new reality",
  "Mande mensagens limpas e profissionais, sem nunca mostrar a fonte original": "Send clean, professional messages without ever showing the original source",
  "Troque os links das mensagens, substitua palavras específicas ou o texto inteiro por algum da sua escolha": "Replace message links, specific words, or the entire text with your own copy",
  "Adicione botões de CTA poderosos que levam seu cliente direto para o checkout": "Add powerful CTA buttons that take your customer straight to checkout",
  "A inteligência do TelePulse automatiza, monitora e mantém seus canais com conteúdos atualizados até com seu PC OFFLINE.": "TelePulse automation monitors and keeps your channels updated even when your PC is OFFLINE.",
  "Confira nossas soluções": "Explore our solutions",
  "soluções": "solutions",
  "Recursos": "Core",
  "Essenciais": "Features",
  "Encaminhamento do seu Próprio Estoque": "Forward From Your Own Content Stock",
  "Organize seus conteúdos num canal privado. O TelePulse repassa tudo preservando emojis premium na qualidade máxima e sem selo de encaminhado, podendo anexar botões.": "Organize your content in a private stock channel. TelePulse republishes everything while preserving premium emojis, original quality, no forwarded label, and optional buttons.",
  "Encaminhamento em Tempo Real": "Real-Time Forwarding",
  "O TelePulse vigia os canais pra você e posta tudo na hora nos seus grupos e canais.": "TelePulse watches channels for you and instantly posts everything to your groups and channels.",
  "Clone tudo de uma vez": "Clone Everything at Once",
  "Copie todas as mensagens antigas instantaneamente. Ideal para quem está começando agora.": "Copy all previous messages instantly. Ideal when you are just starting.",
  "Álbuns Sempre Organizados": "Albums Always Organized",
  "Fotos e vídeos que chegam juntos continuam agrupados, sem bagunça visual.": "Photos and videos that arrive together stay grouped with no visual mess.",
  "Diferenciais Competitivos": "Competitive Advantages",
  "Substituição de textos, Sua Copy, Seus Links": "Text Replacement, Your Copy, Your Links",
  "Troque links e textos da fonte pelos seus automaticamente. O post chega com a sua marca.": "Automatically replace source links and text with your own. Every post lands with your brand.",
  "Botões Anexados nas Mensagens": "Buttons Attached to Messages",
  "Adicione botões com seus próprios links em qualquer mensagem de forma simples.": "Add buttons with your own links to any message easily.",
  "Mensagens Extras": "Extra Messages",
  "Mande um botão respondendo a mensagem encaminhada com uma CTA extra.": "Send a button as a reply to the forwarded message with an extra CTA.",
  "Várias Tarefas ao Meio-Tempo": "Multiple Tasks at the Same Time",
  "Rode quantas automações quiser de uma só vez, sem limitações ou travamentos.": "Run as many automations as you want at once, without limits or freezes.",
  "Dashboard Intuitivo": "Intuitive Dashboard",
  "Saiba exatamente o que o TelePulse está fazendo através de um painel simples e completo.": "Know exactly what TelePulse is doing through a simple, complete dashboard.",
  "Fila Recorrente": "Recurring Queue",
  "Mantenha seus grupos ativos 24h por dia reenviando conteúdos de forma cíclica.": "Keep your groups active 24/7 by reposting content in cycles.",
  "Infraestrutura e Segurança": "Infrastructure and Security",
  "Sua Conta Blindada": "Your Account Protected",
  "Suas contas do Telegram ficam protegidas com métodos que evitam o radar da API.": "Your Telegram accounts stay protected with methods designed to avoid API risk signals.",
  "Fure qualquer Bloqueio": "Bypass Content Restrictions",
  "Clonamos até canais e grupos que tentam proibir o encaminhamento de conteúdo.": "We can clone even channels and groups that try to block content forwarding.",
  "Cuidado Humanizado": "Human-Like Care",
  "O TelePulse age como se fosse você, com intervalos que mantêm sua conta saudável.": "TelePulse behaves like a real user, with intervals that keep your account healthy.",
  "Por que": "Why",
  "Focamos em soluções que multiplicam seu resultado. Escale sem aumentar equipe": "We focus on solutions that multiply your results. Scale without growing your team.",
  "Setup em 5 Minutos": "Setup in 5 Minutes",
  "Interface intuitiva e comandos guiados pelo Telegram. Você não precisa ser técnico para começar.": "Intuitive interface and guided Telegram commands. You do not need to be technical to start.",
  "Estabilidade Comprovada": "Proven Stability",
  "Engine otimizada para lidar com fluxos constantes de grandes volumes de mensagens sem pular nada.": "An engine optimized for constant high-volume message flows without skipping content.",
  "Filtros Inteligentes": "Smart Filters",
  "Limpe o conteúdo original removendo links, nomes ou arquivos indesejados automaticamente.": "Clean original content by automatically removing links, names, or unwanted files.",
  "Casos de": "Use",
  "Uso": "Cases",
  "Como diferentes perfis lucram e automatizam com o TelePulse": "How different operators profit and automate with TelePulse",
  "Alimente grupos de vendas automaticamente": "Feed sales groups automatically",
  "Preserve emojis premium nas mensagens": "Preserve premium emojis in messages",
  "Anexe botões interativos (CTAs) sob as mensagens": "Attach interactive buttons (CTAs) under messages",
  "Sinais de Apostas e Trading": "Betting and Trading Signals",
  "Copie entradas de canais VIP de sinais (Blaze, Bet365, Cripto) e envie para o seu próprio canal no mesmo segundo.": "Copy entries from VIP signal channels (Blaze, Bet365, Crypto) and send them to your own channel instantly.",
  "Replique sinais de Green instantaneamente": "Replicate winning signals instantly",
  "Remova links da concorrência e coloque os seus": "Remove competitor links and add your own",
  "Filtre apenas entradas com alta probabilidade": "Filter only high-probability entries",
  "Canais de Ofertas e Cupons": "Deals and Coupon Channels",
  "Automatize seu canal de promoções. O TelePulse vigia grupos de grandes marcas e posta as ofertas já com seu link de afiliado.": "Automate your deals channel. TelePulse watches brand groups and posts offers with your affiliate link.",
  "Troque links da Amazon/Magalu pelos seus": "Replace Amazon/Magalu links with yours",
  "Crie um feed de promoções 24h sem esforço": "Create a 24/7 deals feed without effort",
  "Mande CTAs exclusivas abaixo de cada oferta": "Send exclusive CTAs under every offer",
  "Estratégias de Nicho Hot": "Hot Niche Strategies",
  "Automatize seus canais de prévias e grupos VIP. Clone conteúdos de outros canais ou grupos e adicione botões de CTA que convertem visitantes em assinantes.": "Automate preview channels and VIP groups. Clone content from other channels or groups and add CTA buttons that convert visitors into subscribers.",
  "Automatizar grupo de prévias 24h": "Automate 24/7 preview groups",
  "Clonar grupos VIPs com perfeição": "Clone VIP groups with precision",
  "Botões de CTA para aumentar conversão": "CTA buttons to increase conversions",
  "Identidade e Estética": "Identity and Aesthetics",
  "Deixe cada postagem com a cara da sua marca. Personalize a cor de botões, use emojis exclusivos e passe mais autoridade para sua audiência.": "Make every post look like your brand. Customize button colors, use exclusive emojis, and build more authority with your audience.",
  "Mudar as cores dos botões de CTA": "Change CTA button colors",
  "Usar Emojis Premium exclusivos": "Use exclusive Premium Emojis",
  "Limpar textos e fontes indesejadas": "Clean unwanted text and sources",
  "Como Funciona": "How It Works",
  "Começar é simples com nosso processo de quatro etapas": "Getting started is simple with our four-step process",
  "Conecte sua Conta": "Connect Your Account",
  "Conecte sua conta do Telegram com segurança para acessar os canais que deseja monitorar.": "Securely connect your Telegram account to access the channels you want to monitor.",
  "Processamento 24/7": "24/7 Processing",
  "Nossa automação funciona continuamente, sua operação roda 24/7 com o PC desligado.": "Our automation runs continuously, so your operation works 24/7 even with your PC turned off.",
  "Defina suas Tarefas": "Define Your Tasks",
  "Crie tarefas personalizadas para filtrar, transformar e encaminhar mensagens.": "Create custom tasks to filter, transform, and forward messages.",
  "Piloto Automático": "Autopilot",
  "Depois de configurar tudo, relaxe, sua estrutura já funciona 100% no piloto automático.": "After setup, relax. Your structure runs fully on autopilot.",
  "Pronto para Escalar sua Operação?": "Ready to Scale Your Operation?",
  "Junte-se a centenas de administradores que já automatizaram seus": "Join hundreds of admins who already automated their",
  "fluxos de trabalho com o TelePulse": "workflows with TelePulse",
  "Perguntas Frequentes": "Frequently Asked Questions",
  "Tudo que você precisa saber": "Everything you need to know",
  "Como posso testar?": "How can I test it?",
  "Oferecemos acesso total gratuito para que você configure seus primeiros fluxos e valide sua operação.": "We offer full free access so you can configure your first flows and validate your operation.",
  "Preciso saber programar?": "Do I need to know how to code?",
  "Zero! Se você usa Telegram, você consegue usar o TelePulse.": "Not at all. If you use Telegram, you can use TelePulse.",
  "Funciona com Canais e Grupos privados?": "Does it work with private Channels and Groups?",
  "Sim, desde que você seja administrador ou membro.": "Yes, as long as you are an admin or a member.",
  "Perde a qualidade das imagens/vídeos?": "Does it reduce image/video quality?",
  "Nunca! Tudo é encaminhado com qualidade 100% original.": "Never. Everything is forwarded in 100% original quality.",
  "E se os Canais ou Grupos usarem emojis premium?": "What if Channels or Groups use premium emojis?",
  "Funcionam perfeitamente, emojis premium são preservados.": "They work perfectly. Premium emojis are preserved.",
  "Todos os direitos reservados.": "All rights reserved.",
  "TelePulse Animador PRO (Grátis)": "TelePulse PRO Animator (Free)",
  "Anime suas imagens promocionais diretamente no seu navegador, sem custo de APIs. Crie conteúdos virais em segundos.": "Animate your promotional images directly in your browser with no API cost. Create viral content in seconds.",
  "Clique para enviar imagem": "Click to upload an image",
  "Qualquer tamanho suportado": "Any supported size",
  "Escolha o Efeito": "Choose an Effect",
  "Gerar Vídeo": "Generate Video",
  "Baixar Vídeo (WebM)": "Download Video (WebM)",
  "O vídeo gerado aparecerá aqui": "Your generated video will appear here",
  "Animando e gravando vídeo (5s)...": "Animating and recording video (5s)...",
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

function translateText(lang: Lang, value: string) {
  if (lang === "pt") return value;
  const key = normalizeText(value);
  return EN_TRANSLATIONS[key] || value;
}

export function translateDocument(lang: Lang) {
  const root = document.getElementById("root");
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) continue;
    if (parent.closest("[data-i18n-ignore='true']")) continue;
    const current = node.nodeValue || "";
    if (!current.trim()) continue;
    const textNode = node as Text & { __telepulseOriginal?: string };
    const original = textNode.__telepulseOriginal || current;
    if (!textNode.__telepulseOriginal) textNode.__telepulseOriginal = original;
    const next = lang === "pt" ? original : translateText(lang, original);
    const leading = current.match(/^\s*/)?.[0] || "";
    const trailing = current.match(/\s*$/)?.[0] || "";
    if (node.nodeValue !== `${leading}${next}${trailing}`) {
      node.nodeValue = `${leading}${next}${trailing}`;
    }
  }
}

export function LanguageSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[0_0_24px_rgba(0,239,255,0.08)]">
      <span
        className={`absolute top-1 bottom-1 w-[46px] rounded-full transition-all duration-300 ${
          lang === "pt"
            ? "left-1 bg-[#009739]/25 shadow-[0_0_18px_rgba(0,151,57,0.35)]"
            : "left-[51px] bg-[#3C3B6E]/45 shadow-[0_0_18px_rgba(60,59,110,0.45)]"
        }`}
      />
      <button
        type="button"
        onClick={() => onChange("pt")}
        aria-label="Português Brasil"
        className={`relative z-10 flex h-9 w-[46px] items-center justify-center rounded-full text-xl transition-transform ${
          lang === "pt" ? "scale-110" : "opacity-55 hover:opacity-100"
        }`}
      >
        🇧🇷
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-label="English United States"
        className={`relative z-10 flex h-9 w-[46px] items-center justify-center rounded-full text-xl transition-transform ${
          lang === "en" ? "scale-110" : "opacity-55 hover:opacity-100"
        }`}
      >
        🇺🇸
      </button>
    </div>
  );
}
