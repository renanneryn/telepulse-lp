import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Copy,
  Edit3,
  Smile,
  Shield,
  HelpCircle,
  Menu,
  X,
  Rocket,
  Send,
  Settings,
  Infinity,
  Repeat,
  Monitor,
  Layout,
  MousePointer2,
  Clock,
  Lock,
  ListChecks,
  Activity,
  MessageSquare,
  Bell,
  UserCheck,
  AlertTriangle,
  Check,
  TrendingUp,
  Newspaper,
  Heart,
  Globe,
  Palette,
  Coffee,
  Package,
  Smartphone,
  Instagram,
  MonitorOff,
  CloudLightning,
  Bot,
} from "lucide-react";
import ScrollReveal from "./components/ScrollReveal";
import Starfield from "./components/Starfield";
import VideoGenerator from "./components/VideoGenerator";

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

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const NeonLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="neon-purple" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="neon-cyan" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="neon-white" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Purple Speech Bubble */}
    <path
      d="M 32 35 L 68 35 A 12 12 0 0 1 80 47 L 80 63 A 12 12 0 0 1 68 75 L 35 75 L 22 88 L 26 71 A 12 12 0 0 1 20 63 L 20 47 A 12 12 0 0 1 32 35 Z"
      stroke="#b517ff"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
      filter="url(#neon-purple)"
    />
    <path
      d="M 32 35 L 68 35 A 12 12 0 0 1 80 47 L 80 63 A 12 12 0 0 1 68 75 L 35 75 L 22 88 L 26 71 A 12 12 0 0 1 20 63 L 20 47 A 12 12 0 0 1 32 35 Z"
      stroke="#ffffff"
      strokeWidth="1"
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Angle Bracket (Cyan) */}
    <g filter="url(#neon-cyan)">
      <path
        d="M 68 63 L 73 68 L 68 73"
        stroke="#00efff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <path
      d="M 68 63 L 73 68 L 68 73"
      stroke="#ffffff"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Paper Airplane (White) */}
    <g filter="url(#neon-white)">
      <path
        d="M 43 63 L 66 53 L 57 72 L 52 64 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M 52 64 L 50 71 L 55 67 Z" fill="#ffffff" />
    </g>

    {/* Swoosh (Cyan) - Back part */}
    <path
      d="M 46 39 C 32 32, 16 38, 18 50"
      stroke="#00efff"
      strokeWidth="2.5"
      strokeLinecap="round"
      filter="url(#neon-cyan)"
    />
    <path
      d="M 46 39 C 32 32, 16 38, 18 50"
      stroke="#ffffff"
      strokeWidth="1"
      strokeLinecap="round"
    />

    {/* Rocket (Cyan) */}
    <g transform="translate(56, 32) rotate(30)">
      {/* Rocket Glow */}
      <g filter="url(#neon-cyan)">
        {/* Left Fin */}
        <path
          d="M -7 5 L -15 18 L -6 13 Z"
          fill="#0F1419"
          stroke="#00efff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right Fin */}
        <path
          d="M 7 5 L 15 18 L 6 13 Z"
          fill="#0F1419"
          stroke="#00efff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Body */}
        <path
          d="M -7 13 C -10 -5, -4 -18, 0 -24 C 4 -18, 10 -5, 7 13 C 3 16, -3 16, -7 13 Z"
          fill="#0F1419"
          stroke="#00efff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Window */}
        <circle
          cx="0"
          cy="-3"
          r="3.5"
          fill="#0F1419"
          stroke="#00efff"
          strokeWidth="2.5"
        />
        {/* Nozzle */}
        <path
          d="M -4 14.5 L -5 18 L 5 18 L 4 14.5 Z"
          fill="#0F1419"
          stroke="#00efff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Rocket Core */}
      <g>
        <path
          d="M -7 5 L -15 18 L -6 13 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M 7 5 L 15 18 L 6 13 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M -7 13 C -10 -5, -4 -18, 0 -24 C 4 -18, 10 -5, 7 13 C 3 16, -3 16, -7 13 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="-3"
          r="3.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
        />
        <path
          d="M -4 14.5 L -5 18 L 5 18 L 4 14.5 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    </g>

    {/* Swoosh (Cyan) - Front part */}
    <path
      d="M 18 50 C 20 62, 38 64, 49 53"
      stroke="#00efff"
      strokeWidth="2.5"
      strokeLinecap="round"
      filter="url(#neon-cyan)"
    />
    <path
      d="M 18 50 C 20 62, 38 64, 49 53"
      stroke="#ffffff"
      strokeWidth="1"
      strokeLinecap="round"
    />

    {/* Double Chevron (Cyan) */}
    <g transform="translate(34, 26) rotate(-20)">
      <g filter="url(#neon-cyan)">
        <path
          d="M -5 -5 L 1 1 L -5 7"
          stroke="#00efff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 3 -5 L 9 1 L 3 7"
          stroke="#00efff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <path
        d="M -5 -5 L 1 1 L -5 7"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 3 -5 L 9 1 L 3 7"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);

const NeonStep1 = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 45 A 15 15 0 1 0 50 15 A 15 15 0 1 0 50 45 Z" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 50 45 A 15 15 0 1 0 50 15 A 15 15 0 1 0 50 45 Z" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 20 85 C 20 65, 35 55, 50 55 C 65 55, 80 65, 80 85" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 20 85 C 20 65, 35 55, 50 55 C 65 55, 80 65, 80 85" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 55 75 L 65 85 L 85 55" stroke="#0F1419" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 55 75 L 65 85 L 85 55" stroke="#00efff" strokeWidth="4" filter="url(#neon-cyan)" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 55 75 L 65 85 L 85 55" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const NeonStep2 = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="55" width="50" height="25" rx="4" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinejoin="round" />
    <rect x="25" y="55" width="50" height="25" rx="4" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" />
    <circle cx="35" cy="67.5" r="3" fill="#ffffff" filter="url(#neon-white)" />
    
    <rect x="25" y="20" width="50" height="25" rx="4" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinejoin="round" />
    <rect x="25" y="20" width="50" height="25" rx="4" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" />
    <circle cx="35" cy="32.5" r="3" fill="#ffffff" filter="url(#neon-white)" />
    
    <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="#00efff" strokeWidth="3" filter="url(#neon-cyan)" strokeLinecap="round" />
    <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="#ffffff" strokeWidth="1" opacity="0.9" strokeLinecap="round" />
    <path d="M 90 35 L 90 50 L 75 50" stroke="#00efff" strokeWidth="3" filter="url(#neon-cyan)" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 90 35 L 90 50 L 75 50" stroke="#ffffff" strokeWidth="1" opacity="0.9" strokeLinejoin="round" strokeLinecap="round" />

    <path d="M 90 50 A 40 40 0 0 1 10 50" stroke="#00efff" strokeWidth="3" filter="url(#neon-cyan)" strokeLinecap="round" />
    <path d="M 90 50 A 40 40 0 0 1 10 50" stroke="#ffffff" strokeWidth="1" opacity="0.9" strokeLinecap="round" />
    <path d="M 10 65 L 10 50 L 25 50" stroke="#00efff" strokeWidth="3" filter="url(#neon-cyan)" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 10 65 L 10 50 L 25 50" stroke="#ffffff" strokeWidth="1" opacity="0.9" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const NeonStep3 = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 30 25 L 80 25 M 30 50 L 80 50 M 30 75 L 80 75" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinecap="round" />
    <path d="M 30 25 L 80 25 M 30 50 L 80 50 M 30 75 L 80 75" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinecap="round" />
    
    <circle cx="45" cy="25" r="8" fill="#1A1F2E" stroke="#00efff" strokeWidth="4" filter="url(#neon-cyan)" />
    <circle cx="45" cy="25" r="8" fill="#1A1F2E" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
    <circle cx="45" cy="25" r="3" fill="#ffffff" filter="url(#neon-white)" />
    
    <circle cx="65" cy="50" r="8" fill="#1A1F2E" stroke="#00efff" strokeWidth="4" filter="url(#neon-cyan)" />
    <circle cx="65" cy="50" r="8" fill="#1A1F2E" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
    <circle cx="65" cy="50" r="3" fill="#ffffff" filter="url(#neon-white)" />
    
    <circle cx="35" cy="75" r="8" fill="#1A1F2E" stroke="#00efff" strokeWidth="4" filter="url(#neon-cyan)" />
    <circle cx="35" cy="75" r="8" fill="#1A1F2E" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
    <circle cx="35" cy="75" r="3" fill="#ffffff" filter="url(#neon-white)" />
  </svg>
);

const NeonStep4 = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="35" width="50" height="40" rx="8" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinejoin="round" />
    <rect x="25" y="35" width="50" height="40" rx="8" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" />
    
    <path d="M 50 35 L 50 15" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" strokeLinecap="round" />
    <path d="M 50 35 L 50 15" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinecap="round" />
    <circle cx="50" cy="15" r="5" fill="#1A1F2E" stroke="#b517ff" strokeWidth="4" filter="url(#neon-purple)" />
    <circle cx="50" cy="15" r="5" fill="#1A1F2E" stroke="#ffffff" strokeWidth="1.5" />
    
    <path d="M 25 45 L 15 45 M 25 65 L 15 65 M 75 45 L 85 45 M 75 65 L 85 65" stroke="#00efff" strokeWidth="4" filter="url(#neon-cyan)" strokeLinecap="round" />
    <path d="M 25 45 L 15 45 M 25 65 L 15 65 M 75 45 L 85 45 M 75 65 L 85 65" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" strokeLinecap="round" />
    
    <line x1="35" y1="50" x2="45" y2="50" stroke="#00efff" strokeWidth="5" filter="url(#neon-cyan)" strokeLinecap="round" />
    <line x1="35" y1="50" x2="45" y2="50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    
    <line x1="55" y1="50" x2="65" y2="50" stroke="#00efff" strokeWidth="5" filter="url(#neon-cyan)" strokeLinecap="round" />
    <line x1="55" y1="50" x2="65" y2="50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    
    <path d="M 40 65 H 60" stroke="#b517ff" strokeWidth="3" filter="url(#neon-purple)" strokeLinecap="round" />
    <path d="M 40 65 H 60" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    "Transforme conteúdos e troque links automaticamente em tempo real.",
    "Copie sinais, ofertas ou conteúdos entre Canais e Grupos com perfeição.",
    "Gerencie dezenas de Canais e Grupos sem precisar de uma equipe.",
    "Monitore, filtre, transforme e encaminhe mensagens automaticamente com suas próprias tarefas. Nunca mais perca o que é importante.",
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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border border-white/5 bg-[#101016]">
                <NeonLogo />
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
              Para começar a automatizar, precisamos conectar sua conta. Siga as
              instruções no nosso bot oficial.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center text-sm">
                    1
                  </span>
                  Acesse o Bot
                </h3>
                <p className="text-gray-400 mb-4">
                  Clique no botão abaixo para abrir o bot no Telegram e obter
                  seu código de acesso.
                </p>
                <a
                  href="https://t.me/tele_pulsebot?start=lp"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Abrir @tele_pulsebot <ArrowRight size={18} />
                </a>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 opacity-50">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                    2
                  </span>
                  Configurar Tarefas
                </h3>
                <p className="text-gray-400">
                  Após conectar, você poderá criar tarefas de encaminhamento e
                  clonagem diretamente por aqui ou pelo bot.
                </p>
              </div>
            </div>
          </div>

          <VideoGenerator />
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
            <div className="w-12 h-12 relative flex items-center justify-center">
              {/* Vortex Ambient Glow */}
              <div className="absolute inset-0 bg-[#00efff]/20 blur-[10px] rounded-full" />

              {/* Vortex Swirls */}
              <div
                className="absolute inset-[-4px] rounded-full animate-vortex"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(168,85,247,0.3) 25%, transparent 50%, rgba(0,239,255,0.3) 75%, transparent 100%)",
                  filter: "blur(2px)",
                  animationDelay: "0s",
                }}
              />
              <div
                className="absolute inset-[-8px] rounded-full animate-vortex"
                style={{
                  background:
                    "conic-gradient(from 90deg, transparent 0%, rgba(0,239,255,0.2) 25%, transparent 50%, rgba(168,85,247,0.2) 75%, transparent 100%)",
                  filter: "blur(4px)",
                  animationDelay: "1.5s",
                  animationDuration: "4s",
                }}
              />

              {/* Event Horizon (Inner Black Hole) */}
              <div className="absolute inset-[1px] bg-[#0F1419] rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,1)] border border-white/5" />

              {/* Icon */}
              <div className="w-10 h-10 relative z-10 flex items-center justify-center">
                <NeonLogo />
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              TelePulse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#benefits"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Benefícios
            </a>
            <a
              href="#use-cases"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Casos de Uso
            </a>
            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Como Funciona
            </a>
            <a
              href="#faq"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              FAQ
            </a>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-[#0088cc]/20"
            >
              Começar Agora
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#161B26] border-b border-white/5 p-4 space-y-4">
            <a
              href="#benefits"
              className="block text-gray-400 p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefícios
            </a>
            <a
              href="#use-cases"
              className="block text-gray-400 p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Casos de Uso
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-400 p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Como Funciona
            </a>
            <a
              href="#faq"
              className="block text-gray-400 p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsMenuOpen(false);
              }}
              className="w-full bg-[#0088cc] text-white py-3 rounded-xl font-bold"
            >
              Começar Agora
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-16 md:pt-32 pb-20 md:pb-24 px-4 text-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-radial-gradient from-[#0088cc]/10 to-transparent blur-[80px] animate-float" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-radial-gradient from-[#161B26]/50 to-transparent blur-[80px] animate-float-reverse" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0}>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-40 h-40 mx-auto mb-8 relative flex items-center justify-center"
            >
              {/* Vortex Ambient Glow */}
              <div className="absolute inset-0 bg-[#00efff]/20 blur-[40px] rounded-full" />

              {/* Vortex Swirls */}
              <div
                className="absolute inset-[-20px] rounded-full animate-vortex"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(168,85,247,0.3) 25%, transparent 50%, rgba(0,239,255,0.3) 75%, transparent 100%)",
                  filter: "blur(8px)",
                  animationDelay: "0s",
                }}
              />
              <div
                className="absolute inset-[-40px] rounded-full animate-vortex"
                style={{
                  background:
                    "conic-gradient(from 90deg, transparent 0%, rgba(0,239,255,0.2) 25%, transparent 50%, rgba(168,85,247,0.2) 75%, transparent 100%)",
                  filter: "blur(12px)",
                  animationDelay: "1.5s",
                  animationDuration: "4s",
                }}
              />
              <div
                className="absolute inset-[-60px] rounded-full animate-vortex"
                style={{
                  background:
                    "conic-gradient(from 180deg, transparent 0%, rgba(168,85,247,0.1) 25%, transparent 50%, rgba(0,239,255,0.1) 75%, transparent 100%)",
                  filter: "blur(16px)",
                  animationDelay: "3s",
                  animationDuration: "5s",
                }}
              />

              {/* Event Horizon (Inner Black Hole) */}
              <div className="absolute inset-[3px] bg-[#0F1419] rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />

              {/* Icon */}
              <NeonLogo className="w-full h-full relative z-10 scale-125" />
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={150}>
            <motion.h1
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
            >
              {Array.from("Operação ").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.1, delay: index * 0.04 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <span className="gradient-text">
                {Array.from("24/7").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.1, delay: (9 + index) * 0.04 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
              <br />
              <div className="text-4xl md:text-5xl mt-2 mb-4">
                {Array.from("Automatize ou Clone Canais e Grupos").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.1, delay: (13 + index) * 0.04 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
              
              <motion.div 
                className="mt-6 mb-4 inline-flex items-center gap-3 px-2 py-2 pr-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, type: "spring" }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/30">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ECC71] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2ECC71]"></span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-300 font-medium tracking-normal">
                  <MonitorOff size={18} className="text-gray-400" />
                  <span>Funciona&nbsp;até&nbsp;com&nbsp;o&nbsp;<strong className="text-white font-bold">PC&nbsp;OFF-LINE</strong></span>
                </div>
              </motion.div>
            </motion.h1>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={300}>
            <div className="min-h-[140px] md:min-h-[80px] flex items-start justify-center mb-6">
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
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("dashboard")}
                className="group bg-gradient-to-r from-[#0088cc] to-[#00aaff] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(0,136,204,0.4)] hover:shadow-[0_0_40px_rgba(0,136,204,0.6)] flex items-center gap-3 relative overflow-hidden w-full sm:w-auto justify-center"
              >
                <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shine" />
                Começar Agora de Graça{" "}
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/5521971779677?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es."
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#2ECC71]/10 border border-[#2ECC71]/40 hover:bg-[#2ECC71]/20 text-[#2ECC71] px-10 py-5 rounded-2xl font-bold text-lg hover:-translate-y-1 flex items-center gap-3 shadow-[0_0_20px_rgba(46,204,113,0.1)] hover:shadow-[0_0_30px_rgba(46,204,113,0.2)] w-full sm:w-auto justify-center"
              >
                <Smartphone
                  size={22}
                  className="group-hover:rotate-12 transition-transform"
                />
                Entrar em Contato
              </motion.a>
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

                <h3 className="text-3xl font-bold mb-8 text-white tracking-tight mt-4">
                  O que você enfrenta hoje
                </h3>

                <ul className="space-y-6">
                  {[
                    "Você fica preso ao encaminhamento manual padrão",
                    "É impossível trocar links das mensagens, limpar nomes e substituir textos automaticamente",
                    "Você não consegue adicionar botões clicáveis de venda nas postagens que recebe",
                    "Perde de tempo total organizando canais e grupos de forma manual",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <X size={14} className="text-red-500" />
                      </div>
                      <p className="text-gray-400 leading-relaxed font-medium">
                        {item}
                      </p>
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

                <h3 className="text-3xl font-bold mb-8 text-white tracking-tight mt-4">
                  Sua nova realidade
                </h3>

                <ul className="space-y-6">
                  {[
                    "Mande mensagens limpas e profissionais, sem nunca mostrar a fonte original",
                    "Troque os links das mensagens, substitua palavras específicas ou o texto inteiro por algum da sua escolha",
                    "Adicione botões de CTA poderosos que levam seu cliente direto para o checkout",
                    "A inteligência do TelePulse automatiza, monitora e mantém seus canais com conteúdos atualizados até com seu PC OFFLINE.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-[#0088cc]/20 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-[#0088cc]" />
                      </div>
                      <p className="text-gray-200 leading-relaxed font-semibold">
                        {item}
                      </p>
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
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                Confira nossas <span className="text-[#0088cc]">soluções</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Group 1: Core Functions */}
          <div className="mb-20">
            <ScrollReveal direction="left">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-1 bg-[#0088cc] rounded-full" /> Recursos
                Essenciais
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureDetailCard
                icon={<Package className="text-[#0088cc]" />}
                title="Encaminhamento do seu Próprio Estoque"
                description="Organize seus conteúdos num canal privado. O TelePulse repassa tudo preservando emojis premium na qualidade máxima e sem selo de encaminhado, podendo anexar botões."
                highlight={true}
              />
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
                <span className="w-10 h-1 bg-[#2ECC71] rounded-full" />{" "}
                Diferenciais Competitivos
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureDetailCard
                icon={<Settings className="text-[#2ECC71]" />}
                title="Substituição de textos, Sua Copy, Seus Links"
                description="Troque links e textos da fonte pelos seus automaticamente. O post chega com a sua marca."
                highlight
              />
              <FeatureDetailCard
                icon={<MousePointer2 className="text-[#2ECC71]" />}
                title="Botões Anexados nas Mensagens"
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
                <span className="w-10 h-1 bg-[#FF6B6B] rounded-full" />{" "}
                Infraestrutura e Segurança
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
        <div
          className="absolute inset-0 bg-[#161B26]/40 backdrop-blur-sm"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                Por que <span className="mx-2"></span>{" "}
                <span className="text-[#0088cc]">TelePulse?</span>
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
                title="Setup em 5 Minutos"
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
              <p className="text-xl text-gray-400">
                Como diferentes perfis lucram e automatizam com o TelePulse
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <UseCaseCard
                icon={<Package size={28} className="text-[#F59E0B]" />}
                title="Encaminhamento do seu Próprio Estoque"
                description="Organize seus conteúdos, mídias e ofertas num canal privado de estoque. O TelePulse encaminha de lá para seus grupos abertos automaticamente, preservando emojis premium na qualidade máxima, removendo o selo de 'encaminhado' e permitindo anexar botões interativos."
                iconBg="bg-[#F59E0B]/10"
                examples={[
                  "Alimente grupos de vendas automaticamente",
                  "Preserve emojis premium nas mensagens",
                  "Anexe botões interativos (CTAs) sob as mensagens",
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <UseCaseCard
                icon={<TrendingUp size={28} className="text-[#2ECC71]" />}
                title="Sinais de Apostas e Trading"
                description="Copie entradas de canais VIP de sinais (Blaze, Bet365, Cripto) e envie para o seu próprio canal no mesmo segundo."
                iconBg="bg-[#2ECC71]/10"
                examples={[
                  "Replique sinais de Green instantaneamente",
                  "Remova links da concorrência e coloque os seus",
                  "Filtre apenas entradas com alta probabilidade",
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <UseCaseCard
                icon={<Newspaper size={28} className="text-[#0088cc]" />}
                title="Canais de Ofertas e Cupons"
                description="Automatize seu canal de promoções. O TelePulse vigia grupos de grandes marcas e posta as ofertas já com seu link de afiliado."
                iconBg="bg-[#0088cc]/10"
                examples={[
                  "Troque links da Amazon/Magalu pelos seus",
                  "Crie um feed de promoções 24h sem esforço",
                  "Mande CTAs exclusivas abaixo de cada oferta",
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={450}>
              <UseCaseCard
                icon={<Heart size={28} className="text-[#FF6B6B]" />}
                title="Estratégias de Nicho Hot"
                description="Automatize seus canais de prévias e grupos VIP. Clone conteúdos de outros canais ou grupos e adicione botões de CTA que convertem visitantes em assinantes."
                iconBg="bg-[#FF6B6B]/10"
                examples={[
                  "Automatizar grupo de prévias 24h",
                  "Clonar grupos VIPs com perfeição",
                  "Botões de CTA para aumentar conversão",
                ]}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <UseCaseCard
                icon={<Palette size={28} className="text-[#A855F7]" />}
                title="Identidade e Estética"
                description="Deixe cada postagem com a cara da sua marca. Personalize a cor de botões, use emojis exclusivos e passe mais autoridade para sua audiência."
                iconBg="bg-[#A855F7]/10"
                examples={[
                  "Mudar as cores dos botões de CTA",
                  "Usar Emojis Premium exclusivos",
                  "Limpar textos e fontes indesejadas",
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
              <p className="text-xl text-gray-400">
                Começar é simples com nosso processo de quatro etapas
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <ScrollReveal direction="up" delay={0}>
              <Step
                number="1"
                title="Conecte sua Conta"
                description="Conecte sua conta do Telegram com segurança para acessar os canais que deseja monitorar."
                icon={<NeonStep1 />}
                iconBgColor="bg-[#a855f7]"
                iconColor="text-white"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <Step
                number="2"
                title="Processamento 24/7"
                description="Nossa automação funciona continuamente, sua operação roda 24/7 com o PC desligado."
                icon={<NeonStep2 />}
                iconBgColor="bg-[#00efff]"
                iconColor="text-white"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <Step
                number="3"
                title="Defina suas Tarefas"
                description="Crie tarefas personalizadas para filtrar, transformar e encaminhar mensagens."
                icon={<NeonStep3 />}
                iconBgColor="bg-[#a855f7]"
                iconColor="text-white"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={450}>
              <Step
                number="4"
                title="Piloto Automático"
                description="Depois de configurar tudo, relaxe, sua estrutura já funciona 100% no piloto automático."
                icon={<NeonStep4 />}
                iconBgColor="bg-[#00efff]"
                iconColor="text-white"
                isLast
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[#161B26]/60 backdrop-blur-sm"
          style={{
            maskImage: "linear-gradient(to top, black, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Pronto para Escalar sua Operação?
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <p className="text-xl text-gray-400 mb-12">
              Junte-se a centenas de administradores que já automatizaram seus
              fluxos de trabalho com o TelePulse
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={350} duration={800}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 shadow-2xl shadow-[#0088cc]/30 flex items-center gap-2"
              >
                Começar Agora <ArrowRight size={24} />
              </button>
              <a
                href="https://wa.me/5521971779677?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2ECC71]/10 border border-[#2ECC71]/40 hover:bg-[#2ECC71]/20 text-[#2ECC71] px-12 py-6 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 shadow-2xl shadow-[#2ECC71]/10 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <Smartphone size={24} />
                Falar no WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Perguntas Frequentes
              </h2>
              <p className="text-xl text-gray-400">
                Tudo que você precisa saber
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal direction="up" delay={0}>
              <FAQItem
                question="Como posso testar?"
                answer="Oferecemos acesso total gratuito para que você configure seus primeiros fluxos e valide sua operação."
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150}>
              <FAQItem
                question="Preciso saber programar?"
                answer="Zero! Se você usa Telegram, você consegue usar o TelePulse."
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <FAQItem
                question="Funciona com Canais e Grupos privados?"
                answer="Sim, desde que você seja administrador ou membro."
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={450}>
              <FAQItem
                question="Perde a qualidade das imagens/vídeos?"
                answer="Nunca! Tudo é encaminhado com qualidade 100% original."
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <FAQItem
                question="E se os Canais ou Grupos usarem emojis premium?"
                answer="Funcionam perfeitamente, emojis premium são preservados."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 flex flex-col items-center justify-center text-center">
        <a
          href="https://instagram.com/tl_pulse"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors mb-6 flex items-center gap-2 font-medium"
        >
          <Instagram size={20} />
          @tl_pulse
        </a>
        <p className="text-gray-500 text-sm">
          &copy; 2026 TelePulse. Todos os direitos reservados.
        </p>
      </footer>
      <AIChatWidget />
    </div>
  );
}

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Oi! Posso tirar suas duvidas sobre automacao, clone e espelhamento no Telegram.",
    },
  ]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Falha no chat");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error?.message ||
            "Nao consegui responder agora. Tente de novo em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#101621]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0088cc]/20 text-[#00efff]">
                <Bot size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Chat IA</div>
                <div className="text-xs text-gray-400">TelePulse</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex max-h-[420px] min-h-[300px] flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-[#0088cc] text-white"
                    : "mr-auto border border-white/10 bg-white/[0.08] text-gray-100"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-gray-300">
                Digitando...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pergunte sobre o TelePulse"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#0088cc]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0088cc] text-white transition-colors hover:bg-[#0077b5] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Enviar mensagem"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-2xl shadow-[#0088cc]/30 transition-all hover:-translate-y-1 hover:bg-[#0077b5]"
        aria-label="Abrir chat IA"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
  examples,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
  iconBg: string;
}) {
  return (
    <div className="bg-[#1A1F2E]/60 backdrop-blur-sm border border-white/5 rounded-[40px] p-8 h-full transition-all hover:border-[#0088cc]/30 group">
      <div
        className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-8">
        {description}
      </p>

      <div className="space-y-3">
        <p className="text-[10px] font-bold tracking-widest text-[#0088cc] uppercase">
          Exemplos:
        </p>
        <ul className="space-y-3">
          {examples.map((ex, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm text-gray-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0088cc]" />
              {ex}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="h-full bg-[#1A1F2E] border border-white/5 rounded-[32px] p-10 hover:-translate-y-2 transition-all hover:border-[#0088cc]/30 hover:shadow-2xl">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative group flex flex-col h-full">
      <div className="bg-[#1A1F2E]/60 backdrop-blur-sm rounded-[40px] p-10 shadow-2xl border border-white/5 flex flex-col items-center text-center h-full transition-all duration-500 hover:border-white/20 hover:-translate-y-2 hover:bg-[#1A1F2E]/80">
        <div
          className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-8 ${iconColor} group-hover:scale-110 transition-transform duration-500`}
        >
          {/* Glow layers */}
          <div
            className={`absolute inset-0 rounded-full ${iconBgColor} bg-opacity-20 backdrop-blur-md border border-white/10`}
          />
          <div
            className={`absolute inset-0 rounded-full ${iconBgColor} opacity-20 blur-xl group-hover:opacity-60 transition-opacity duration-500`}
          />
          <div
            className={`absolute inset-2 rounded-full ${iconBgColor} opacity-30 blur-md`}
          />

          {/* Icon with drop shadow */}
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 text-white tracking-tight">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 flex-grow">
          {description}
        </p>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-500 border border-white/5 group-hover:bg-white/10 group-hover:text-white transition-colors">
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-[#1A1F2E] border border-white/5 rounded-2xl p-8 hover:border-[#0088cc]/30 transition-all">
      <div className="font-bold text-lg mb-3 text-[#0088cc]">{question}</div>
      <div className="text-gray-400 leading-relaxed">{answer}</div>
    </div>
  );
}

function FeatureDetailCard({
  icon,
  title,
  description,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group relative bg-[#1A1F2E]/60 border ${highlight ? "border-[#0088cc]/40 shadow-[0_0_20px_rgba(0,136,204,0.15)]" : "border-white/5"} rounded-2xl p-6 transition-all hover:border-[#0088cc]/30 hover:-translate-y-1`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 group-hover:text-[#0088cc] transition-colors">
        {title}
      </h4>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
