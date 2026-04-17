/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  ChevronDown,
  MessageCircle,
  MessageSquare,
  Headphones,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  variant?: "primary" | "secondary" | "outline" 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 text-base font-semibold transition-all duration-300 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-transform";
  const variants = {
    primary: "bg-ink text-white hover:bg-zinc-800",
    secondary: "bg-accent text-white hover:bg-blue-600",
    outline: "border-2 border-ink text-ink hover:bg-ink/5"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Section = ({ 
  children, 
  id, 
  className = "", 
  dark = false 
}: { 
  children: React.ReactNode; 
  id?: string; 
  className?: string; 
  dark?: boolean 
}) => (
  <section 
    id={id} 
    className={`py-24 px-6 md:px-12 ${dark ? 'bg-ink text-white' : 'bg-paper text-ink'} ${className}`}
  >
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const Title = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-4xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight ${className}`}>
    {children}
  </h2>
);

const Highlight = ({ children, color = "accent" }: { children: React.ReactNode; color?: "accent" | "success" | "yellow" }) => {
  const colors = {
    accent: "text-accent",
    success: "text-success",
    yellow: "text-amber-500"
  };
  return <span className={colors[color]}>{children}</span>;
};

const HeroTag = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center bg-white border border-zinc-200 px-3 py-1 font-medium text-xs text-zinc-500 uppercase tracking-wide mb-6 rounded-full shadow-sm">
    <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
    {children}
  </div>
);

const CardTitle = ({ children, number }: { children: React.ReactNode; number?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    {number && (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-ink text-white text-[10px] font-bold">
        {number}
      </span>
    )}
    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
      {children}
    </span>
  </div>
);

// --- Analytics Logic ---
const FACEBOOK_PIXEL_ID = (import.meta as any).env.VITE_FACEBOOK_PIXEL_ID;
const GA_ID = (import.meta as any).env.VITE_GOOGLE_ANALYTICS_ID;

const trackEvent = (eventName: string, params = {}) => {
  // FB Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
  console.log(`[Analytics] Evento: ${eventName}`, params);
};

export default function App() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Inicialização dos Pixels
  useEffect(() => {
    // 1. Injetar Meta Pixel
    if (FACEBOOK_PIXEL_ID) {
      (function(f: any,b: any,e: any,v: any,n?: any,t?: any,s?: any)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js'));
      (window as any).fbq('init', FACEBOOK_PIXEL_ID);
      (window as any).fbq('track', 'PageView');
    }

    // 2. Injetar Google Analytics
    if (GA_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = function(...args: any[]){(window as any).dataLayer.push(args);};
      (window as any).gtag = gtag;
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', GA_ID);
    }
  }, []);

  const handleCTA = (location: string) => {
    trackEvent('InitiateCheckout', { 
      content_name: 'Método Site Lucrativo',
      content_category: 'Low Ticket Digital Product',
      location: location 
    });
    window.open('https://calendly.com/luanvinisilva93/reuniao-metodo-site-lucrativo?locale=pt-BR', '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setShowStickyCTA(scrollPercent > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="font-sans selection:bg-accent/10 selection:text-ink">
      {/* Sticky CTA */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Button 
                onClick={() => handleCTA('sticky_cta')}
                className="w-full md:w-auto shadow-2xl bg-accent hover:bg-blue-600 border-none px-12 py-5 font-bold"
              >
                Agendar Minha Aula Agora <ArrowRight className="ml-2 w-5 h-5 text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-24 bg-paper overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-20 hidden md:block">
           <div className="relative">
              <motion.div 
                animate={{ rotate: 12 }}
                className="w-64 h-64 bg-white border border-zinc-200 rounded-3xl shadow-xl p-8 flex flex-col justify-center"
              >
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="text-success w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold leading-none mb-2">+R$ 2.000</p>
                  <p className="text-zinc-500 font-medium text-sm">Renda Extra Mensal</p>
              </motion.div>
              <motion.div 
                animate={{ rotate: -8 }}
                className="absolute -bottom-10 -left-10 w-48 h-48 bg-white border border-zinc-200 rounded-2xl shadow-lg p-6 flex flex-col justify-center"
              >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Zap key={i} className="w-3 h-3 text-amber-500 fill-current" />)}
                  </div>
                  <p className="font-bold text-sm">"Site fechado em 24h"</p>
                  <p className="text-zinc-400 text-xs mt-1">@joaovitor_vendas</p>
              </motion.div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <HeroTag>Vagas Limitadas • Método Validado</HeroTag>
            <h1 className="text-6xl md:text-8xl font-black text-ink leading-tight mb-8 tracking-tighter">
              A maneira mais <Highlight color="accent">inteligente</Highlight> de lucrar com sites simples.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 mb-12 leading-relaxed">
              Transforme comércios locais em fontes de renda de <Highlight color="success">R$500 por projeto</Highlight>. Sem programar, sem enrolação.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Button 
                onClick={() => handleCTA('hero')}
                variant="secondary" 
                className="w-full md:w-auto px-12 py-5 text-lg"
              >
                Agendar Minha Vaga
              </Button>
              <div className="flex items-center text-zinc-400 text-sm font-semibold uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 mr-2 text-success" /> Método à prova de falhas
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Identificação de Dor */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <CardTitle number="01">O Problema</CardTitle>
            <Title>O salário <Highlight color="yellow">acaba no meio do mês</Highlight> e a frustração só aumenta?</Title>
            <p className="text-lg text-zinc-500 mb-10 leading-relaxed">
              A maioria das pessoas está presa em uma rotina que paga pouco e exige muito. O mercado digital é a saída, mas ele parece complexo demais.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Preso em salários baixos",
                "Falta de tempo livre",
                "Sem rumo no digital",
                "Medo das contas"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-paper rounded-2xl border border-zinc-100">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="font-bold text-zinc-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/5 rounded-[40px] blur-3xl" />
            <div className="relative bg-paper p-12 rounded-[40px] border border-zinc-200 shadow-sm">
               <p className="text-xl font-medium text-zinc-800 leading-relaxed italic">
                 "Eu via todo mundo faturando na internet e eu continuava no mesmo lugar. Parecia que faltava uma peça. Este método foi exatamente o que eu precisava para começar do zero."
               </p>
               <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-200 rounded-full" />
                    <span className="font-bold text-sm">Relato Real</span>
                  </div>
                  <div className="flex gap-1 text-success">
                    {[...Array(5)].map((_, i) => <CheckCircle2 key={i} className="w-4 h-4 fill-current" />)}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Apresentação do Método */}
      <Section className="bg-paper">
        <div className="text-center mb-20">
          <CardTitle>O Método</CardTitle>
          <Title>Foque no que traz <Highlight color="success">resultado real</Highlight></Title>
          <p className="max-w-3xl mx-auto text-xl text-zinc-500 font-medium">
            Esqueça o desenvolvimento complexo. Nós focamos no essencial para o cliente e lucrativo para você.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="w-8 h-8 text-white" />,
              title: "Clientes Reais",
              desc: "O mercado de comércios locais é imenso e está desesperado por presença online."
            },
            {
              icon: <Zap className="w-8 h-8 text-white" />,
              title: "Velocidade PIX",
              desc: "Projetos de 40 minutos que pagam R$500 na hora da entrega sem enrolação."
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-white" />,
              title: "Manutenção",
              desc: "Aprenda a criar contratos mensais para ter uma renda garantida todo mês."
            }
          ].map((item, i) => (
            <motion.div 
              whileHover={{ y: -8 }}
              key={i} 
              className="p-10 bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-ink rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 4. Como Funciona na Prática */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <CardTitle>Operacional</CardTitle>
          <Title>O caminho mais <Highlight color="accent">fácil</Highlight> para o seu primeiro lucro digital</Title>
          <div className="mt-20 space-y-4">
            {[
              { step: "01", title: "Prospecção Inteligente", desc: "Use ferramentas estratégicas para encontrar quem precisa de você agora." },
              { step: "02", title: "O Script Milionário", desc: "Copie e cole as palavras exatas para fechar o contrato." },
              { step: "03", title: "Montagem Express", desc: "Arraste e solte elementos seguindo nosso modelo campeão." },
              { step: "04", title: "Escala", desc: "Repita o processo e construa sua agência de um homem só." }
            ].map((item, i) => (
              <div key={i} className="group p-8 bg-paper rounded-3xl border border-zinc-100 flex items-start gap-8 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="w-14 h-14 bg-ink text-white rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-accent transition-colors">
                  {item.step}
                </div>
                <div>
                   <h3 className="text-2xl font-bold mb-2 tracking-tight">{item.title}</h3>
                   <p className="text-zinc-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button 
              onClick={() => handleCTA('process_section')}
              variant="secondary" 
              className="px-16"
            >
              Quero Meu Primeiro Site Hoje
            </Button>
          </div>
        </div>
      </Section>

      {/* 5. O Que Você Vai Receber & 6. Material Incluso */}
      <Section className="bg-paper">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <CardTitle number="02">Entregas</CardTitle>
            <Title>O arsenal para sua <Highlight color="accent">jornada lucrativa</Highlight></Title>
            <div className="grid grid-cols-1 gap-6">
              {[
                { t: "Treinamento Mestre", s: "A estratégia completa do zero ao faturamento real" },
                { t: "Biblioteca de Templates", s: "Modelos profissionais otimizados para alta conversão" },
                { t: "Script de Vendas Irresistível", s: "As palavras exatas para converter curiosos em clientes pagantes" },
                { t: "Guia de Prospecção Local", s: "Como encontrar e abordar 10 novos clientes por dia" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-ink">{item.t}</h3>
                  <p className="text-zinc-500 text-sm font-medium italic">{item.s}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col justify-center">
            <div className="bg-ink text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px]" />
               <div className="relative z-10">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Investimento</p>
                  <h3 className="text-6xl font-black mb-8 leading-none">AULA <Highlight color="success">EXCLUSIVA</Highlight></h3>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex -space-x-2">
                       {[...Array(4)].map((_, i) => <div key={i} className="w-10 h-10 bg-zinc-700 border-2 border-ink rounded-full" />)}
                    </div>
                    <span className="text-zinc-400 text-sm font-bold">+120 pessoas agendadas hoje</span>
                  </div>
                  <Button 
                    onClick={() => handleCTA('offer_card')}
                    className="w-full bg-white text-ink hover:bg-zinc-100 border-none font-bold py-5"
                  >
                    Garantir Minha Vaga Agora
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Prova Lógica (Math) */}
      <Section dark className="bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
            <Title>A <Highlight color="yellow">Matemática Simples</Highlight> do Ganho</Title>
            <div className="grid md:grid-cols-3 gap-8 mt-12 bg-black p-12 rounded-3xl border border-zinc-800">
                <div>
                   <p className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold">Cada Site</p>
                   <p className="text-5xl font-black text-white">R$ 500</p>
                </div>
                <div className="flex items-center justify-center text-4xl text-zinc-700">×</div>
                <div>
                   <p className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold">1 Por Semana</p>
                   <p className="text-5xl font-black text-success">R$ 2.000</p>
                </div>
            </div>
            <p className="mt-12 text-xl text-gray-400 leading-relaxed italic">
              "Imagine fazer apenas 1 site por semana. No final do mês, você terá R$ 2.000,00 extras. Isso é mais do que a maioria dos brasileiros ganha trabalhando 220 horas por mês."
            </p>
            <div className="mt-12">
               <Button 
                onClick={() => handleCTA('proof_section')}
                className="w-full md:w-auto" 
                variant="primary"
               >
                Agendar Aula Agora
               </Button>
            </div>
        </div>
      </Section>

      {/* 8. Transparência */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Title>Sem Segredos, <Highlight>Total Transparência</Highlight></Title>
            <p className="text-lg text-gray-600 mb-8">
              Você não vai ficar rico da noite para o dia sem fazer nada. Este é um trabalho sério que exige execução. Eu vou te dar o mapa, mas você precisa caminhar.
            </p>
            <div className="space-y-4">
               {[
                 { q: "Precisa de faculdade?", a: "Não. Precisa apenas de força de vontade e um computador ou celular." },
                 { q: "Tenho que investir dinheiro?", a: "Absolutamente zero para começar. Ensinamos ferramentas estratégicas." },
                 { q: "E se eu não conseguir?", a: "O método é baseado em prática. Se você seguir, o resultado vem." }
               ].map((item, i) => (
                 <div key={i} className="border-b border-gray-100 pb-4">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left font-black text-xl mb-2 flex items-center justify-between group"
                    >
                      <span className="flex items-center">
                        <Zap className="w-5 h-5 text-amber-500 mr-2" /> {item.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-gray-600 overflow-hidden"
                        >
                          {item.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                 </div>
               ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-success/5 rounded-full blur-2xl" />
             <div className="relative bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success font-bold mr-4">JV</div>
                    <div>
                      <p className="font-bold">João Vitor</p>
                      <p className="text-xs text-zinc-500">Aluno do Método</p>
                    </div>
                </div>
                <p className="text-zinc-600 italic">
                  "Eu estava cético, mas fechei meu primeiro site para uma padaria no terceiro dia aplicando o script. Recebi R$ 450 no PIX antes mesmo de terminar o site. O método é absurdo."
                </p>
                <div className="mt-6 flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Zap key={i} className="w-4 h-4 fill-current" />)}
                </div>
             </div>
          </div>
        </div>
      </Section>

      {/* 10. Público-Alvo & 11. Anti-Público */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-12 bg-white border border-zinc-100 rounded-[40px] shadow-sm">
            <h3 className="text-3xl font-bold text-ink mb-10 flex items-center">
               Para quem construímos isso
            </h3>
            <ul className="space-y-6">
              {[
                "Pessoas buscando renda extra imediata",
                "Quem quer trabalhar de casa",
                "Interessados em marketing e vendas",
                "Totalmente iniciantes sem base técnica"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-12 bg-paper rounded-[40px] border border-zinc-100 opacity-60">
            <h3 className="text-3xl font-bold text-zinc-400 mb-10">
               Para quem NÃO é
            </h3>
            <ul className="space-y-6">
              {[
                "Procuradores de facilidades sem esforço",
                "Satisfeitos com a renda atual",
                "Quem não gosta de lidar com pessoas",
                "Colecionadores de cursos teóricos"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-400 font-medium">
                  <XCircle className="w-5 h-5 text-zinc-300 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 12. Conclusão & 13. CTA Final */}
      <Section className="bg-ink text-white pt-32 pb-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 blur-[120px] rounded-full translate-y-1/2" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="inline-block py-1 px-4 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-10">
            Acesso Imediato
          </div>
          <Title className="max-w-4xl mx-auto mb-12 text-center leading-tight">Pronto para dar o primeiro passo rumo à sua <Highlight color="accent">independência</Highlight>?</Title>
          <p className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto font-medium text-center leading-relaxed">
            Junte-se a centenas de iniciantes que descobriram o poder dos sites simples. O próximo relato pode ser o seu.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => handleCTA('final_footer')}
              variant="secondary" 
              className="px-20 py-6 text-xl shadow-[0_20px_40px_rgba(59,130,246,0.3)]"
            >
              Agendar Minha Vaga Agora
            </Button>
          </div>

          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
             <p>© 2026 MÉTODO SITE LUCRATIVO. TODOS OS DIREITOS RESERVADOS.</p>
             <div className="flex gap-10">
               <a href="#" className="hover:text-accent transition-colors">TERMOS</a>
               <a href="#" className="hover:text-accent transition-colors">PRIVACIDADE</a>
             </div>
          </div>
        </motion.div>
      </Section>

      {/* Chat Widgets Flutuantes */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {/* Botão de WhatsApp */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            onClick={() => {
              trackEvent('Contact', { method: 'whatsapp' });
              window.open('https://wa.me/5571997201723?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20Método%20Site%20Lucrativo', '_blank');
            }}
            className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute right-full mr-4 bg-white text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Dúvidas no WhatsApp
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
