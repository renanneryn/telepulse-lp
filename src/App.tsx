import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Zap, Copy, Edit3, Smile, Shield, HelpCircle, Menu, X, Rocket, Send, Settings, Infinity, Repeat, Monitor, Layout, MousePointer2, Clock, Lock, ListChecks, Activity, MessageSquare, Bell, UserCheck, AlertTriangle, Check, TrendingUp, Newspaper, Heart, Globe, Palette } from "lucide-react";
import ScrollReveal from "./components/ScrollReveal";
import Starfield from "./components/Starfield";

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    "Transforme conteúdos e troque links automaticamente em tempo real.",
    "Copie sinais, ofertas ou conteúdos entre Canais e Grupos com perfeição.",
    "Gerencie dezenas de Canais e Grupos sem precisar de uma equipe.",
    "Monitore, filtre, transforme e encaminhe mensagens automaticamente com seus próprios fluxos. Nunca mais perca o que é importante."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (activeTab === "dashboard") {
    return (
      <div className="min-h-screen bg-[#0F1419] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F1419] border border-[#0088cc]/50 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,136,204,0.3)]">
                <Rocket size={24} className="text-[#0088cc]" />
              </div>
              <span className="font-extrabold text-xl">TelePulse</span>
            </div>
            <button 
              onClick={() => setActiveTab("landing")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Voltar para Home
            </button>
          </div>

          <div className="bg-[#1A1F2E] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Conectar Telegram</h2>
            <p className="text-gray-400 mb-8">
              Para começar a automatizar, precisamos conectar sua conta. Siga as instruções no nosso bot oficial.
            </p>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center text-sm">1</span>
                  Acesse o Bot
                </h3>
                <p className="text-gray-400 mb-4">
                  Clique no botão abaixo para abrir o bot no Telegram e obter seu código de acesso.
                </p>
                <a 
                  href="https://t.me/encaminhadorabot" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Abrir @encaminhadorabot <ArrowRight size={18} />
                </a>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 opacity-50">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">2</span>
                  Configurar Tarefas
                </h3>
                <p className="text-gray-400">
                  Após conectar, você poderá criar tarefas de encaminhamento e clonagem diretamente por aqui ou pelo bot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-pattern min-h-screen relative">
      <Starfield />
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0F1419]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0F1419] border border-[#0088cc]/50 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,136,204,0.4)]">
              <Rocket size={28} className="text-[#0088cc] neon-text-blue" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">TelePulse</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-gray-400 hover:text-white transition-colors font-medium">Benefícios</a>
            <a href="#use-cases" className="text-gray-400 hover:text-white transition-colors font-medium">Casos de Uso</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors font-medium">Como Funciona</a>
            <a href="#faq" className="text-gray-400 hover:text-white transition-colors font-medium">FAQ</a>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-[#0088cc]/20"
            >
              Começar Agora
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#161B26] border-b border-white/5 p-4 space-y-4">
            <a href="#benefits" className="block text-gray-400 p-2" onClick={() => setIsMenuOpen(false)}>Benefícios</a>
            <a href="#use-cases" className="block text-gray-400 p-2" onClick={() => setIsMenuOpen(false)}>Casos de Uso</a>
            <a href="#how-it-works" className="block text-gray-400 p-2" onClick={() => setIsMenuOpen(false)}>Como Funciona</a>
            <a href="#faq" className="block text-gray-400 p-2" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <button 
              onClick={() => { setActiveTab("dashboard"); setIsMenuOpen(false); }}
              className="w-full bg-[#0088cc] text-white py-3 rounded-xl font-bold"
            >
              Começar Agora
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-radial-gradient from-[#0088cc]/10 to-transparent blur-[80px] animate-float" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-radial-gradient from-[#161B26]/50 to-transparent blur-[80px] animate-float-reverse" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal direction="left" delay={0}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.05, 1],
                y: [0, -5, 0]
              }}
              transition={{ 
                opacity: { duration: 0.5 },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-block bg-[#0088cc]/10 border border-[#0088cc]/20 text-[#0088cc] px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(0,136,204,0.2)]"
            >
              🎉 100% Gratuito • Ilimitado • Completo
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={150}>
            <motion.h1 
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
            >
              {Array.from("Escala ").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.1, delay: index * 0.04 }}
                >
                  {char}
                </motion.span>
              ))}
              <span className="gradient-text">
                {Array.from("Total").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.1, delay: (6 + index) * 0.04 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              {Array.from(": Automatize Grupos, Lucre Mais").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.1, delay: (11 + index) * 0.04 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={300}>
            <div className="h-20 md:h-12 flex items-center justify-center mb-12">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={phraseIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                  <TypewriterText text={phrases[phraseIndex]} />
                </motion.p>
              </AnimatePresence>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={450}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="group bg-[#0088cc] hover:bg-[#0077b5] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-2xl shadow-[#0088cc]/30 flex items-center gap-2"
              >
                Começar Agora de Graça <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* The Problem */}
            <ScrollReveal direction="left">
              <div className="relative group bg-[#1A1F2E]/40 backdrop-blur-sm border border-red-500/10 rounded-[40px] p-10 h-full transition-all hover:bg-[#1A1F2E]/60 hover:border-red-500/20">
                <div className="absolute -top-6 -left-2">
                  <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
                    <AlertTriangle size={28} />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-8 text-white tracking-tight mt-4">O que você enfrenta hoje</h3>
                
                <ul className="space-y-6">
                  {[
                    "Você fica preso ao encaminhamento manual padrão",
                    "É impossível trocar links das mensagens, limpar nomes e substituir textos automaticamente",
                    "Você não consegue adicionar botões clicáveis de venda nas postagens que recebe",
                    "Perda de tempo total tentando filtrar o que presta de forma manual e lenta"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <X size={14} className="text-red-500" />
                      </div>
                      <p className="text-gray-400 leading-relaxed font-medium">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* The Solution */}
            <ScrollReveal direction="right">
              <div className="relative group bg-[#0088cc]/5 backdrop-blur-sm border border-[#0088cc]/20 rounded-[40px] p-10 h-full transition-all hover:bg-[#0088cc]/10 hover:border-[#0088cc]/30 shadow-2xl shadow-[#0088cc]/5">
                <div className="absolute -top-6 -left-2">
                  <div className="w-14 h-14 bg-[#0088cc]/20 border border-[#0088cc]/30 rounded-2xl flex items-center justify-center text-[#0088cc] shadow-xl shadow-[#0088cc]/10">
                    <CheckCircle size={28} />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-8 text-white tracking-tight mt-4">Sua nova realidade</h3>
                
                <ul className="space-y-6">
                  {[
                    "Mande mensagens limpas e profissionais, sem nunca mostrar a fonte original",
                    "Troque os links das mensagens, substitua palavras específicas ou o texto inteiro por algum da sua escolha",
                    "Adicione botões de CTA poderosos que levam seu cliente direto para o checkout",
                    "A inteligência do TelePulse filtra, limpa e entrega tudo mastigado 24h por dia"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-[#0088cc]/20 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-[#0088cc]" />
                      </div>
                      <p className="text-gray-200 leading-relaxed font-semibold">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Feature Showcase - The "Meat" of the Bot */}
      <section className="py-24 px-4 bg-[#0F1419]/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Confira nossas <span className="text-[#0088cc]">soluções</span></h2>
            </div>
          </ScrollReveal>

          {/* Group 1: Core Functions */}
          <div className="mb-20">
            <ScrollReveal direction="left">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-1 bg-[#0088cc] rounded-full" /> Recursos Essenciais
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureDetailCard 
                icon={<Repeat className="text-[#0088cc]" />}
                title="Encaminhamento em Tempo Real"
                description="O TelePulse vigia os canais pra você e posta tudo na hora nos seus grupos e canais."
              />
              <FeatureDetailCard 
                icon={<Copy className="text-[#0088cc]" />}
                title="Clone tudo de uma vez"
                description="Copie todas as mensagens antigas instantaneamente. Ideal para quem está começando agora."
              />
              <FeatureDetailCard 
                icon={<Smile className="text-[#0088cc]" />}
                title="Emojis Premium de Verdade"
                description="Seus emojis continuam funcionando perfeitamente, inclusive os exclusivos do Premium."
              />
              <FeatureDetailCard 
                icon={<Layout className="text-[#0088cc]" />}
                title="Álbuns Sempre Organizados"
                description="Fotos e vídeos que chegam juntos continuam agrupados, sem bagunça visual."
              />
            </div>
          </div>

          {/* Group 2: Differentiators */}
          <div className="mb-20">
            <ScrollReveal direction="left">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-1 bg-[#2ECC71] rounded-full" /> Diferenciais Competitivos
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureDetailCard 
                icon={<Settings className="text-[#2ECC71]" />}
                title="Sua Copy, Seus Links"
                description="Troque links e textos da fonte pelos seus automaticamente. O post chega com a sua marca."
                highlight
              />
              <FeatureDetailCard 
                icon={<MousePointer2 className="text-[#2ECC71]" />}
                title="Botões que Vendem"
                description="Adicione botões com seus próprios links em qualquer mensagem de forma simples."
              />
              <FeatureDetailCard 
                icon={<Send className="text-[#2ECC71]" />}
                title="Mensagens Extras"
                description="Mande um botão respondendo a mensagem encaminhada com uma CTA extra."
              />
              <FeatureDetailCard 
                icon={<Infinity className="text-[#2ECC71]" />}
                title="Várias Tarefas ao Meio-Tempo"
                description="Rode quantas automações quiser de uma só vez, sem limitações ou travamentos."
              />
              <FeatureDetailCard 
                icon={<Monitor className="text-[#2ECC71]" />}
                title="Dashboard Intuitivo"
                description="Saiba exatamente o que o TelePulse está fazendo através de um painel simples e completo."
              />
              <FeatureDetailCard 
                icon={<Repeat className="text-[#2ECC71]" />}
                title="Fila Recorrente"
                description="Mantenha seus grupos ativos 24h por dia reenviando conteúdos de forma cíclica."
              />
            </div>
          </div>

          {/* Group 3: Technical Specs */}
          <div>
            <ScrollReveal direction="left">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-1 bg-[#FF6B6B] rounded-full" /> Infraestrutura e Segurança
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureDetailCard 
                icon={<Lock className="text-[#FF6B6B]" />}
                title="Sua Conta Blindada"
                description="Suas contas do Telegram ficam protegidas com métodos que evitam o radar da API."
              />
              <FeatureDetailCard 
                icon={<Shield className="text-[#FF6B6B]" />}
                title="Fure qualquer Bloqueio"
                description="Clonamos até canais e grupos que tentam proibir o encaminhamento de conteúdo."
              />
              <FeatureDetailCard 
                icon={<Clock className="text-[#FF6B6B]" />}
                title="Cuidado Humanizado"
                description="O TelePulse age como se fosse você, com intervalos que mantêm sua conta saudável."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#161B26]/40 backdrop-blur-sm" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                Por que <span className="mx-2"></span> <span className="text-[#0088cc]">TelePulse?</span>
              </h2>
              <p className="text-xl text-gray-400">
                <TypewriterText text="Focamos em soluções que multiplicam seu resultado. Escale sem aumentar equipe" />
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <BenefitCard 
                icon={<Rocket className="text-[#0088cc]" />} 
                title="Setup em 1 Minuto" 
                description="Interface intuitiva e comandos guiados pelo Telegram. Você não precisa ser técnico para começar."
                color="rgba(0, 136, 204, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <BenefitCard 
                icon={<Activity className="text-[#2ECC71]" />} 
                title="Estabilidade Comprovada" 
                description="Engine otimizada para lidar com fluxos constantes de grandes volumes de mensagens sem pular nada."
                color="rgba(46, 204, 113, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <BenefitCard 
                icon={<ListChecks className="text-[#FF6B6B]" />} 
                title="Filtros Inteligentes" 
                description="Limpe o conteúdo original removendo links, nomes ou arquivos indesejados automaticamente."
                color="rgba(255, 107, 107, 0.1)"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Casos de <span className="text-[#0088cc]">Uso</span>
              </h2>
              <p className="text-xl text-gray-400">Como diferentes perfis lucram e automatizam com o TelePulse</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <UseCaseCard 
                icon={<TrendingUp size={28} className="text-[#2ECC71]" />}
                title="Sinais de Apostas e Trading"
                description="Copie entradas de canais VIP de sinais (Blaze, Bet365, Cripto) e envie para o seu próprio canal no mesmo segundo."
                iconBg="bg-[#2ECC71]/10"
                examples={[
                  "Replique sinais de Green instantaneamente",
                  "Remova links da concorrência e coloque os seus",
                  "Filtre apenas entradas com alta probabilidade"
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <UseCaseCard 
                icon={<Newspaper size={28} className="text-[#0088cc]" />}
                title="Canais de Ofertas e Cupons"
                description="Automatize seu canal de promoções. O TelePulse vigia grupos de grandes marcas e posta as ofertas já com seu link de afiliado."
                iconBg="bg-[#0088cc]/10"
                examples={[
                  "Troque links da Amazon/Magalu pelos seus",
                  "Crie um feed de promoções 24h sem esforço",
                  "Mande CTAs exclusivas abaixo de cada oferta"
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <UseCaseCard 
                icon={<Heart size={28} className="text-[#FF6B6B]" />}
                title="Estratégias de Nicho Hot"
                description="Automatize seus canais de prévias e grupos VIP. Clone conteúdos de outros canais ou grupos e adicione botões de CTA que convertem visitantes em assinantes."
                iconBg="bg-[#FF6B6B]/10"
                examples={[
                  "Automatizar grupo de prévias 24h",
                  "Clonar grupos VIPs com perfeição",
                  "Botões de CTA para aumentar conversão"
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={450}>
              <UseCaseCard 
                icon={<Palette size={28} className="text-[#A855F7]" />}
                title="Identidade e Estética"
                description="Deixe cada postagem com a cara da sua marca. Personalize a cor de botões, use emojis exclusivos e passe mais autoridade para sua audiência."
                iconBg="bg-[#A855F7]/10"
                examples={[
                  "Mudar as cores dos botões de CTA",
                  "Usar Emojis Premium exclusivos",
                  "Limpar textos e fontes indesejadas"
                ]}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-40 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-[#DB2777] bg-clip-text text-transparent">
                Como Funciona
              </h2>
              <p className="text-xl text-gray-400">Começar é simples com nosso processo de quatro etapas</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <ScrollReveal direction="up" delay={0}>
              <Step 
                number="1" 
                title="Conecte sua Conta" 
                description="Conecte sua conta do Telegram com segurança para acessar os canais que deseja monitorar." 
                icon={<UserCheck />} 
                iconBgColor="bg-blue-500" 
                iconColor="text-blue-400"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <Step 
                number="2" 
                title="Defina seus Fluxos" 
                description="Crie fluxos personalizados para filtrar, transformar e encaminhar mensagens." 
                icon={<Settings />} 
                iconBgColor="bg-purple-500" 
                iconColor="text-purple-400"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <Step 
                number="3" 
                title="Processamento 24/7" 
                description="Nosso monitor funciona continuamente, aplicando seus fluxos a cada mensagem em tempo real." 
                icon={<MessageSquare />} 
                iconBgColor="bg-teal-500" 
                iconColor="text-teal-400"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={450}>
              <Step 
                number="4" 
                title="Informações Filtradas" 
                description="Receba apenas as mensagens que importam, formatadas exatamente como você deseja." 
                icon={<Bell />} 
                iconBgColor="bg-orange-500" 
                iconColor="text-orange-400"
                isLast
              />
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[#161B26]/60 backdrop-blur-sm" style={{ maskImage: 'linear-gradient(to top, black, transparent)', WebkitMaskImage: 'linear-gradient(to top, black, transparent)' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Pronto para Escalar sua Operação?</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <p className="text-xl text-gray-400 mb-12">Junte-se a centenas de administradores que já automatizaram seus fluxos de trabalho com o TelePulse</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={350} duration={800}>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 shadow-2xl shadow-[#0088cc]/30 flex items-center gap-2 mx-auto"
            >
              Começar Agora <ArrowRight size={24} />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Perguntas Frequentes</h2>
              <p className="text-xl text-gray-400">Tudo que você precisa saber</p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal direction="up" delay={0}><FAQItem question="Como posso testar?" answer="Oferecemos acesso total gratuito para que você configure seus primeiros fluxos e valide sua operação." /></ScrollReveal>
            <ScrollReveal direction="up" delay={150}><FAQItem question="Preciso saber programar?" answer="Zero! Se você usa Telegram, você consegue usar o TelePulse." /></ScrollReveal>
            <ScrollReveal direction="up" delay={300}><FAQItem question="Funciona com Canais e Grupos privados?" answer="Sim, desde que você seja administrador ou membro." /></ScrollReveal>
            <ScrollReveal direction="up" delay={450}><FAQItem question="Perde a qualidade das imagens/vídeos?" answer="Nunca! Tudo é encaminhado com qualidade 100% original." /></ScrollReveal>
            <ScrollReveal direction="up" delay={600}><FAQItem question="E se os Canais ou Grupos usarem emojis premium?" answer="Funcionam perfeitamente, emojis premium são preservados." /></ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 text-center">
        <p className="text-gray-500 text-sm">&copy; 2026 TelePulse. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}

function UseCaseCard({ icon, title, description, examples, iconBg }: { icon: React.ReactNode, title: string, description: string, examples: string[], iconBg: string }) {
  return (
    <div className="bg-[#1A1F2E]/60 backdrop-blur-sm border border-white/5 rounded-[40px] p-8 h-full transition-all hover:border-[#0088cc]/30 group">
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-8">{description}</p>
      
      <div className="space-y-3">
        <p className="text-[10px] font-bold tracking-widest text-[#0088cc] uppercase">Exemplos:</p>
        <ul className="space-y-3">
          {examples.map((ex, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0088cc]" />
              {ex}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="h-full bg-[#1A1F2E] border border-white/5 rounded-[32px] p-10 hover:-translate-y-2 transition-all hover:border-[#0088cc]/30 hover:shadow-2xl">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description, icon, iconBgColor, iconColor, isLast }: { 
  number: string, 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  iconBgColor: string, 
  iconColor: string,
  isLast?: boolean 
}) {
  return (
    <div className="relative group flex flex-col h-full">
      <div className="bg-[#1A1F2E]/60 backdrop-blur-sm rounded-[40px] p-10 shadow-2xl border border-white/5 flex flex-col items-center text-center h-full transition-all duration-500 hover:border-[#0088cc]/30 hover:-translate-y-2">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 ${iconBgColor} ${iconColor} bg-opacity-10 backdrop-blur-md border border-white/10`}>
           {React.cloneElement(icon as React.ReactElement, { size: 36, strokeWidth: 1.5 })}
        </div>
        <h3 className="text-xl font-bold mb-4 text-white tracking-tight">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 flex-grow">{description}</p>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-500 border border-white/5">
          {number}
        </div>
      </div>
      {!isLast && (
         <div className="hidden xl:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-20 items-center opacity-20">
            <div className="w-4 h-px bg-white/20" />
            <ArrowRight className="text-white/40" size={20} strokeWidth={1} />
            <div className="w-4 h-px bg-white/20" />
         </div>
      )}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-[#1A1F2E] border border-white/5 rounded-2xl p-8 hover:border-[#0088cc]/30 transition-all">
      <div className="font-bold text-lg mb-3 text-[#0088cc]">{question}</div>
      <div className="text-gray-400 leading-relaxed">{answer}</div>
    </div>
  );
}

function FeatureDetailCard({ icon, title, description, highlight }: { icon: React.ReactNode, title: string, description: string, highlight?: boolean }) {
  return (
    <div className={`group relative bg-[#1A1F2E]/60 border ${highlight ? 'border-[#0088cc]/40 shadow-[0_0_20px_rgba(0,136,204,0.15)]' : 'border-white/5'} rounded-2xl p-6 transition-all hover:border-[#0088cc]/30 hover:-translate-y-1`}>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 group-hover:text-[#0088cc] transition-colors">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
