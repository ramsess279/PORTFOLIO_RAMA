import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, TrendingUp, Layers, Sparkles, ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTheme } from "@/hooks/useTheme";

const phrases = [
  "Bonjour, je suis Ramatoulaye.",
  "Je conçois, je développe, je livre.",
  "Du cahier des charges à la production.",
];

const pillars = [
  {
    num: "01",
    title: "Développement",
    desc: "React, Node, PHP, Java & Spring Boot, architecture hexagonale.",
    icon: Code2,
  },
  {
    num: "02",
    title: "Business Analyst",
    desc: "Cahier des charges, user stories, UML, Agile.",
    icon: TrendingUp,
  },
  {
    num: "03",
    title: "Design & UX",
    desc: "Maquettes Figma, web et mobile.",
    icon: Layers,
  },
  {
    num: "04",
    title: "IA & Automatisation",
    desc: "Développement assisté par l'IA, outils et agents (vibecoding).",
    icon: Sparkles,
  },
];

const Home = () => {
  // Dialogue typewriter / evaporate effect
  const [started, setStarted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [evaporating, setEvaporating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || evaporating) return;
    const current = phrases[phraseIndex];
    if (charIndex < current.length) {
      setSpeaking(true);
      const t = setTimeout(() => setCharIndex((c) => c + 1), 42);
      return () => clearTimeout(t);
    }
    setSpeaking(false);
    setShowHint(true);
    const t = setTimeout(() => {
      setShowHint(false);
      setEvaporating(true);
      setTimeout(() => {
        setEvaporating(false);
        setCharIndex(0);
        setPhraseIndex((p) => (p + 1) % phrases.length);
      }, 550);
    }, 1900);
    return () => clearTimeout(t);
  }, [started, charIndex, phraseIndex, evaporating]);

  // Avatar interactions: hover tilt, double-click sparkle burst, drag + spring back
  const avatarRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [poked, setPoked] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<{ id: number; dx: number; dy: number }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [springBack, setSpringBack] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handleAvatarMouseMove = (e: React.MouseEvent) => {
    if (dragging || !avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 10, y: -py * 8 });
  };

  const handleDoubleClick = () => {
    setPoked(false);
    requestAnimationFrame(() => setPoked(true));
    const burst = Array.from({ length: 10 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 40;
      return { id: Date.now() + i, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
    });
    setSparkles(burst);
    setTimeout(() => setSparkles([]), 750);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setSpringBack(false);
    dragStart.current = { x: e.clientX - dragPos.x, y: e.clientY - dragPos.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setDragPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    };
    const onUp = () => {
      setDragging(false);
      setSpringBack(true);
      setDragPos({ x: 0, y: 0 });
      setTimeout(() => setSpringBack(false), 700);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const avatarTransform = dragging
    ? `translate(${dragPos.x}px, ${dragPos.y}px)`
    : `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`;

  const revealRef = useReveal();
  const { theme } = useTheme();

  // Giant background watermark: fades in on load, drifts gently with the cursor
  const [watermarkIn, setWatermarkIn] = useState(false);
  const [watermarkOffset, setWatermarkOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setWatermarkIn(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setWatermarkOffset({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-8 md:px-[5vw] py-24 md:py-0">
        <img
          src={theme === "dark" ? "/branding/logo-a-lavishly-yours-dark.png" : "/branding/logo-a-lavishly-yours-light.png"}
          alt=""
          aria-hidden="true"
          className="absolute select-none pointer-events-none w-[min(46vw,640px)] h-auto"
          style={{
            top: "4vh",
            left: "28%",
            opacity: watermarkIn ? 0.12 : 0,
            transform: `translate(${watermarkOffset.x}px, ${watermarkOffset.y}px)`,
            transition: "opacity 2s ease, transform 0.2s ease-out",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1680px] w-full flex flex-col md:flex-row items-center gap-10 md:gap-[clamp(3rem,10vw,10rem)]">
          {/* Avatar + dialogue */}
          <div className="flex-none w-full md:w-[480px] flex flex-col items-center md:items-start">
           <div className="relative flex flex-col items-center md:items-start">
            <div
              ref={avatarRef}
              className={`avatar-figure relative w-[220px] md:w-[440px] select-none ${
                hovering ? "hovering" : ""
              } ${dragging ? "dragging" : ""} ${poked ? "poked" : ""} ${speaking ? "speaking" : ""}`}
              style={{
                transform: avatarTransform,
                transition: springBack
                  ? "transform 0.7s cubic-bezier(.34,1.56,.64,1)"
                  : undefined,
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => {
                setHovering(false);
                setTilt({ x: 0, y: 0 });
              }}
              onMouseMove={handleAvatarMouseMove}
              onDoubleClick={handleDoubleClick}
              onMouseDown={handleMouseDown}
              onAnimationEnd={() => setPoked(false)}
            >
              <div className="avatar-glow" aria-hidden="true" />
              <img src="/avatar-rg.png" alt="Ramatoulaye Gueye" className="w-full h-auto block pointer-events-none relative" draggable={false} />
              {sparkles.map((s) => (
                <span
                  key={s.id}
                  className="sparkle-particle"
                  style={{
                    left: "50%",
                    top: "50%",
                    ["--sparkle-end" as string]: `translate(${s.dx}px, ${s.dy}px)`,
                  }}
                />
              ))}
            </div>

            <div className="dialogue-box mt-5 md:mt-0 md:absolute md:top-[4%] md:-right-[8%] w-full max-w-[280px] md:max-w-[240px] rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md px-5 py-4">
              <div className="text-[10px] tracking-[0.16em] uppercase text-primary mb-1.5">
                Ramatoulaye Gueye
              </div>
              <div className={`dialogue-text text-sm leading-relaxed min-h-[2.7em] ${evaporating ? "evaporating" : ""}`}>
                {phrases[phraseIndex].slice(0, charIndex)}
                <span className="dialogue-cursor" />
              </div>
              <div
                className={`text-[10px] text-muted-foreground text-right mt-2 transition-opacity duration-300 ${
                  showHint ? "opacity-70" : "opacity-0"
                }`}
              >
                continuer ▸
              </div>
            </div>
           </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block text-[11px] md:text-xs tracking-[0.22em] uppercase text-primary mb-5">
              Développeuse Fullstack & Business Analyst
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-[clamp(2.8rem,6.2vw,6rem)] font-normal leading-[1.05] text-foreground">
              Je conçois,
              <br />
              je <em className="accent-italic">construis</em>,
              <br />
              je livre.
            </h1>
            <p className="mt-6 text-base md:text-[clamp(1.05rem,1.3vw,1.35rem)] text-muted-foreground leading-relaxed max-w-[640px] mx-auto md:mx-0">
              D'un cahier des charges à la mise en production et la maintenance —
              développement, analyse métier et design produit réunis en une seule personne.
            </p>
            <div className="mt-9 flex flex-wrap gap-6 items-center justify-center md:justify-start">
              <Button variant="primary" to="/projects" label="Voir mes projets" />
              <Link
                to="/contact"
                className="text-xs tracking-[0.14em] uppercase text-foreground border-b border-border pb-1.5 hover:border-foreground transition-colors"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro lede */}
      <section className="max-w-[920px] mx-auto px-8 py-24 md:py-32 text-center">
        <p className="reveal-blur font-normal text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground">
          Je ne me contente pas d'écrire du code. Je pars d'un{" "}
          <em className="accent-italic">besoin réel</em>, je le structure, je le conçois
          visuellement, puis je le développe — jusqu'à la mise en production et au-delà.
        </p>
      </section>

      {/* Pillars */}
      <section className="max-w-[1080px] mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-border">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="pillar-card reveal-blur border-b md:border-r border-border md:last:border-r-0 p-8 hover:bg-muted/40 transition-colors"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="text-sm text-primary font-display block mb-3">{pillar.num}</span>
              <pillar.icon className="pillar-icon h-6 w-6 text-primary mb-3.5 opacity-85" strokeWidth={1.4} />
              <h3 className="text-xl mb-2 font-normal">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              <span className="pillar-arrow absolute bottom-4 right-5 text-primary text-base">→</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Button = ({ to, label, variant }: { to: string; label: string; variant: "primary" }) => (
  <Link
    to={to}
    className="group relative inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3 text-xs tracking-[0.14em] uppercase text-foreground overflow-hidden transition-colors hover:text-primary-foreground"
  >
    <span
      className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-x-100"
      style={{ background: "var(--gradient-primary)" }}
    />
    {label}
    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
  </Link>
);

export default Home;
