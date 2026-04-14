import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Zap, Copy, Edit3, Smile, Shield, HelpCircle, Menu, X, Rocket, Send } from "lucide-react";
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
    "Encaminhe em tempo real ou clone históricos completos.",
    "Substitua textos automaticamente.",
    "Tudo em um só bot. 100% gratuito."
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
              <span className="font-extrabold text-xl">Telepulse</span>
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
            <span className="font-extrabold text-xl tracking-tight">Telepulse</span>
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
              {Array.from("A Solução ").map((char, index) => (
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
                {Array.from("Completa").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.1, delay: (10 + index) * 0.04 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              {Array.from(" de Automação Para Telegram").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.1, delay: (18 + index) * 0.04 }}
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

      {/* Benefits */}
      <section id="benefits" className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#161B26]/40 backdrop-blur-sm" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                Por que <span className="mx-2"></span> <span className="text-[#0088cc]">Telepulse?</span>
              </h2>
              <p className="text-xl text-gray-400">A automação mais completa do mercado, sem gastar um centavo</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <BenefitCard 
                icon={<Zap className="text-[#0088cc]" />} 
                title="Encaminhamento em Tempo Real 24/7" 
                description="Monitore vários canais/grupos e distribua automaticamente para onde quiser."
                color="rgba(0, 136, 204, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <BenefitCard 
                icon={<Copy className="text-[#2ECC71]" />} 
                title="Clone de Histórico Completo" 
                description="Copie todas as mensagens antigas já postadas. Perfeito para backup ou migração."
                color="rgba(46, 204, 113, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <BenefitCard 
                icon={<Edit3 className="text-[#FF6B6B]" />} 
                title="Substitua Textos e Links" 
                description="Troque parte do texto, o texto todo ou apenas os links. Personalize cada mensagem."
                color="rgba(255, 107, 107, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0}>
              <BenefitCard 
                icon={<Smile className="text-[#0066CC]" />} 
                title="Emojis Premium Preservados" 
                description="Substituições compatíveis com emojis exclusivos. Formatação e álbuns intactos."
                color="rgba(0, 102, 204, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <BenefitCard 
                icon={<CheckCircle className="text-[#0088cc]" />} 
                title="Canais e Grupos" 
                description="Funciona tanto com canais quanto grupos, públicos ou privados."
                color="rgba(0, 136, 204, 0.1)"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <BenefitCard 
                icon={<Shield className="text-[#D4AF37]" />} 
                title="Zero Reais. Zero Limites." 
                description="Tarefas ilimitadas, canais e grupos ilimitados. Use sem custo."
                color="rgba(212, 175, 55, 0.1)"
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
              <Step number="1" title="Abra o Bot" description="Acesse @encaminhadorabot no Telegram" />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={150}>
              <Step number="2" title="Conecte sua Conta" description="Conecte sua conta Telegram ao bot" />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={300}>
              <Step number="3" title="Conecte sua Conta" description="Conecte sua conta Telegram ao bot" />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={450}>
              <Step number="4" title="Deixe a Mágica Acontecer" description="Aperte 'Iniciar' e relaxe" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#161B26]/40 backdrop-blur-sm" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Dois Modos de Automação</h2>
              <p className="text-xl text-gray-400">Encaminhe novas mensagens ou clone histórico completo</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} duration={800}>
            <div className="max-w-5xl mx-auto bg-[#0A0E14]/40 backdrop-blur-2xl border border-[#0088cc]/30 rounded-[40px] p-8 md:p-16 shadow-[0_0_30px_rgba(0,136,204,0.1)] relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0088cc]/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div className="text-center">
                  <div className="text-6xl mb-6">⚡</div>
                  <h3 className="text-2xl font-bold mb-4 text-[#0088cc]">Encaminhamento</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Monitore canais/grupos e encaminhe automaticamente <strong>mensagens novas</strong> conforme são postadas.
                  </p>
                  <div className="bg-[#0088cc]/10 rounded-2xl p-4 text-sm text-gray-400 leading-loose">
                    ✓ 1 → Vários destinos<br />✓ Vários → 1 destino<br />✓ Canais E grupos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-6">📋</div>
                  <h3 className="text-2xl font-bold mb-4 text-[#2ECC71]">Clone</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Clona <strong>todo o histórico</strong> de mensagens e mídias antigas já postadas.
                  </p>
                  <div className="bg-[#2ECC71]/10 rounded-2xl p-4 text-sm text-gray-400 leading-loose">
                    ✓ Somente 1 → 1<br />✓ Copia tudo do passado<br />✓ Canais E grupos
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-12 border-t border-white/10 text-center">
                <p className="text-lg text-gray-400 leading-relaxed">
                  <strong className="text-[#0088cc]">Em ambos os modos:</strong> Substitua textos, links ou partes específicas automaticamente em cada mensagem. Tudo compatível com emojis premium e álbuns de mídia!
                </p>
              </div>
            </div>
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
            <ScrollReveal direction="up" delay={0}><FAQItem question="É realmente gratuito?" answer="Sim! O Telepulse é 100% gratuito no momento, sem limites de uso." /></ScrollReveal>
            <ScrollReveal direction="up" delay={150}><FAQItem question="Preciso saber programar?" answer="Zero. Se você usa Telegram, você consegue usar o Telepulse." /></ScrollReveal>
            <ScrollReveal direction="up" delay={300}><FAQItem question="Funciona com canais privados?" answer="Sim, desde que você seja administrador ou membro." /></ScrollReveal>
            <ScrollReveal direction="up" delay={450}><FAQItem question="Perde a qualidade das imagens/vídeos?" answer="Nunca. Tudo é copiado com qualidade 100% original." /></ScrollReveal>
            <ScrollReveal direction="up" delay={600}><FAQItem question="E se o canal usar emojis premium?" answer="Funciona perfeitamente. Emojis exclusivos são preservados." /></ScrollReveal>
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
            <p className="text-xl text-gray-400 mb-12">Junte-se a centenas de administradores que já automatizaram seus fluxos de trabalho com o Telepulse</p>
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
        <p className="text-gray-500 text-sm">&copy; 2026 Telepulse. Todos os direitos reservados.</p>
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
