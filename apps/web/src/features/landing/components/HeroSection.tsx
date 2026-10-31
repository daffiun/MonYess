import { useRef, useEffect } from 'react';
import { Play, ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { LANDING_CONTENT } from '../content';

interface HeroSectionProps {
  onOpenShowreel: () => void;
  onOpenProjectModal: () => void;
}

export default function HeroSection({ onOpenShowreel, onOpenProjectModal }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // Buttery-smooth GSAP entrance sequence
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          '.hero-line',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.4'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-10 px-6 md:px-12 bg-black overflow-hidden noise-overlay select-none"
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

      {/* Center Giant Editorial Headline Block */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12 md:py-16">
        {/* Eyebrow badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 eyebrow-badge mb-6 md:mb-8">
          <Sparkles size={12} className="text-accent" />
          <span>{LANDING_CONTENT.hero.eyebrow}</span>
        </div>

        {/* Fluid clamp typography with high-impact stagger lines */}
        <h1 className="text-[12vw] sm:text-[11vw] lg:text-[9.5vw] font-display font-black tracking-[-0.05em] leading-[0.88] text-white uppercase">
          <div className="hero-line overflow-hidden">
            <span>TRACK</span>
          </div>
          <div className="hero-line overflow-hidden">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              SMARTER.
            </span>{' '}
            <span className="text-accent italic font-light hover:not-italic transition-all duration-300">
              SPEND WISER.
            </span>
          </div>
        </h1>

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
