import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Zap, Copy, Edit3, Smile, Shield, HelpCircle, Menu, X, Rocket, Send, Settings, Infinity, Repeat, Monitor, Layout, MousePointer2, Clock, Lock, ListChecks, Activity } from "lucide-react";
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
    "A automação definitiva para escalar sua operação no Telegram."
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
                title="Espelhamento de Canais e Grupos"
                description="Monitore Canais e Grupos e replique instantaneamente nos seus próprios Canais e Grupos."
              />
              <FeatureDetailCard 
                icon={<Copy className="text-[#0088cc]" />}
                title="Clonagem de Conteúdo"
                description="Copie todas as mensagens e mídias antigas já postadas. Perfeito para backup ou migração."
              />
              <FeatureDetailCard 
                icon={<Smile className="text-[#0088cc]" />}
                title="Emojis Premium Preservados"
                description="Transformações de texto compatíveis com emojis premium do telegram."
              />
              <FeatureDetailCard 
                icon={<Layout className="text-[#0088cc]" />}
                title="Organização de Mídia"
                description="Fotos e vídeos agrupados permanecem juntos, favorecendo uma experiência visual agradável para seus leads."
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
                title="Transformação de Textos"
                description="Remova / Substitua todos os links de uma só vez, substitua o conteúdo inteiro da mensagem pela sua própria copy, e muito mais..."
                highlight
              />
              <FeatureDetailCard 
                icon={<MousePointer2 className="text-[#2ECC71]" />}
                title="Botões Personalizados"
                description="Adicione botões clicáveis com seus próprios links em suas mensagens, tudo 100% personalizável."
              />
              <FeatureDetailCard 
                icon={<Send className="text-[#2ECC71]" />}
                title="Mensagens Complementares"
                description="Envie uma mensagem automática logo abaixo da mensagem encaminhada com direito a botões clicáveis e um texto de sua escolha."
              />
              <FeatureDetailCard 
                icon={<Infinity className="text-[#2ECC71]" />}
                title="Gerenciamento em Massa"
                description="Rode quantas tarefas quiser ao mesmo tempo. Gerencie grandes Canais e Grupos com facilidade."
              />
              <FeatureDetailCard 
                icon={<Monitor className="text-[#2ECC71]" />}
                title="Painel Detalhado"
                description="Acompanhe o progresso de cada automação e saiba exatamente o que está acontecendo."
              />
              <FeatureDetailCard 
                icon={<Repeat className="text-[#2ECC71]" />}
                title="Ciclo Infinito"
                description="Mantenha seus Canais e Grupos sempre ativos reenviando conteúdos de forma programada."
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
                title="Segurança Máxima"
                description="Sua conta Telegram é protegida. Usamos métodos seguros para evitar bloqueios de API."
              />
              <FeatureDetailCard 
                icon={<Shield className="text-[#FF6B6B]" />}
                title="Bypass Inteligente"
                description="Clona até Canais e Grupos que proíbem cópia e encaminhamento."
              />
              <FeatureDetailCard 
                icon={<Clock className="text-[#FF6B6B]" />}
                title="Blindagem Anti-Ban"
                description="Intervalos aleatórios que mimetizam humanos, favorecendo sua conta saudável por anos."
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

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Como Funciona?</h2>
              <p className="text-xl text-gray-400">4 passos simples para automatizar tudo</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <ScrollReveal direction="left" delay={0}>
              <Step number="1" title="Inicie o Bot" description="Acesse @encaminhadorabot no Telegram" />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={150}>
              <Step number="2" title="Conecte-se" description="Faça o login seguro usando a API oficial do Telegram" />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={300}>
              <Step number="3" title="Selecione os Alvos" description="Defina as fontes de conteúdo e os seus Canais e Grupos de destino" />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={450}>
              <Step number="4" title="Automatize" description="Aperte 'Iniciar' e veja a mágica acontecer sozinha" />
            </ScrollReveal>
          </div>
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
            <ScrollReveal direction="up" delay={450}><FAQItem question="Perde a qualidade das imagens/vídeos?" answer="Nunca! Tudo é copiado com qualidade 100% original." /></ScrollReveal>
            <ScrollReveal direction="up" delay={600}><FAQItem question="E se os Canais ou Grupos usarem emojis premium?" answer="Funcionam perfeitamente, emojis premium são preservados." /></ScrollReveal>
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

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 text-center">
        <p className="text-gray-500 text-sm">&copy; 2026 TelePulse. Todos os direitos reservados.</p>
      </footer>

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

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center relative">
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#0088cc] to-[#0088cc]/60 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-xl shadow-[#0088cc]/30">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
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
