import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { LANDING_CONTENT } from '../content';

interface HeroSectionProps {
  onOpenShowreel: () => void;
  onOpenProjectModal: () => void;
}

const GLITCH_PHRASES = ['TRACK SMARTER.', 'SPEND WISER.'];

export default function HeroSection({ onOpenShowreel }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // Spotlight hover state
  const [isHovered, setIsHovered] = useState(false);

  // Glitch alternating phrase state (cycles every 3 seconds)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(GLITCH_PHRASES[0]);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsGlitching(true);

      // Mid-glitch swap (140ms in)
      const swapTimeout = setTimeout(() => {
        setPhraseIndex((prev) => {
          const next = (prev + 1) % GLITCH_PHRASES.length;
          setDisplayText(GLITCH_PHRASES[next]);
          return next;
        });
      }, 140);

      // End glitch effect (300ms total)
      const endTimeout = setTimeout(() => {
        setIsGlitching(false);
      }, 300);

      return () => {
        clearTimeout(swapTimeout);
        clearTimeout(endTimeout);
      };
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // 120 FPS hardware-accelerated spotlight coordinate tracker without React re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    headlineRef.current.style.setProperty('--spotlight-x', `${x}px`);
    headlineRef.current.style.setProperty('--spotlight-y', `${y}px`);
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Buttery-smooth GSAP entrance sequence
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-line',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power4.out',
        }
      )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 md:pt-28 pb-10 px-6 md:px-12 bg-black overflow-hidden noise-overlay select-none"
    >
      {/* Background ambient video loop with soft vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={LANDING_CONTENT.hero.videoPoster}
          className="w-full h-full object-cover"
        >
          <source src={LANDING_CONTENT.hero.videoPlaceholder} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
      </div>

      {/* Center Giant Editorial Headline Block (adjusted position: balanced slightly lower) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto pt-4 md:pt-8 pb-12 md:pb-16 -translate-y-1.5 md:-translate-y-4">
        {/* Slanted hover wrapper with cursor-following circular spotlight */}
        <div
          ref={headlineRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative inline-block transition-transform duration-300 ease-out origin-bottom-left hover:skew-x-[-6deg] cursor-default"
        >
          {/* Base Layer */}
          <h1 className="text-[12vw] sm:text-[11vw] lg:text-[9.5vw] font-display font-black tracking-[-0.05em] leading-[0.88] uppercase select-none">
            <div className="hero-line overflow-hidden">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                EVERY DAY.
              </span>
            </div>
            <div className="hero-line overflow-hidden pt-1 md:pt-2">
              <span
                className={`relative inline-block text-accent italic font-light transition-all duration-300 ${
                  isGlitching ? 'glitch-active' : ''
                }`}
              >
                {displayText}

                {/* Glitch chromatic aberration split slices */}
                {isGlitching && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 select-none pointer-events-none glitch-layer-cyan"
                    >
                      {displayText}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 select-none pointer-events-none glitch-layer-pink"
                    >
                      {displayText}
                    </span>
                  </>
                )}
              </span>
            </div>
          </h1>

          {/* Spotlight Overlay Layer (Only the circle around cursor turns pure white with glow) */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none select-none spotlight-mask transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-[12vw] sm:text-[11vw] lg:text-[9.5vw] font-display font-black tracking-[-0.05em] leading-[0.88] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.85)]">
              <div className="overflow-hidden">
                <span>EVERY DAY.</span>
              </div>
              <div className="overflow-hidden pt-1 md:pt-2">
                <span
                  className={`relative inline-block italic font-light ${
                    isGlitching ? 'glitch-active' : ''
                  }`}
                >
                  {displayText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, authentic description */}
        <p
          ref={descRef}
          className="mt-6 md:mt-8 max-w-xl text-base md:text-lg text-zinc-300 font-sans font-light leading-relaxed"
        >
          A modern personal finance tracker with zero-friction Telegram logging, gamified habit building, and clean analytics. Engineered solo in Indonesia.
        </p>

        {/* Action Buttons */}
        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/login"
            className="px-8 py-4 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <span>Launch Web App</span>
            <ArrowUpRight size={15} />
          </Link>

          <a
            href="#work"
            className="px-7 py-4 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Bottom Showreel Controller & Scroll Bar */}
      <div
        ref={bottomBarRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono"
      >
        {/* Clickable Showcase Capsule */}
        <button
          type="button"
          data-cursor="PLAY"
          onClick={onOpenShowreel}
          className="group text-left flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-accent rounded-full py-2 px-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(204,255,0,0.2)]"
        >
          <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_12px_#CCFF00]">
            <Play size={13} fill="currentColor" className="ml-0.5" />
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold group-hover:text-accent transition-colors duration-200">
              WATCH APP SHOWCASE
            </span>
            <span className="text-zinc-500 text-[10px]">FULLSCREEN PREVIEW • 1:03 MIN</span>
          </div>
        </button>

        {/* Scroll anchor */}
        <a
          href="#intro"
          className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-2"
        >
          <span className="tracking-widest text-[11px]">SCROLL TO DISCOVER</span>
          <ArrowDown size={14} className="text-accent group-hover:translate-y-1 transition-transform duration-300" />
        </a>
      </div>
    </section>
  );
}
