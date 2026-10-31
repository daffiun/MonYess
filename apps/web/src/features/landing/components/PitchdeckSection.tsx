import { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

export default function PitchdeckSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = LANDING_CONTENT.pitchdeck.slides;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="deck" className="py-28 px-6 md:px-12 bg-[#0c0c10] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="eyebrow-badge">{LANDING_CONTENT.pitchdeck.badge}</div>

            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-tight">
              {LANDING_CONTENT.pitchdeck.title}
            </h2>

            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              {LANDING_CONTENT.pitchdeck.subtitle}
            </p>

            {/* Slide Index Tabs */}
            <div className="space-y-3 pt-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.number}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    activeSlide === idx
                      ? 'border-accent bg-accent/10 text-white shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-1">
                    <span className={activeSlide === idx ? 'text-accent font-bold' : 'text-zinc-500'}>
                      Layer {slide.number}
                    </span>
                    {activeSlide === idx && <Sparkles size={14} className="text-accent" />}
                  </div>
                  <div className="text-base font-bold text-white">{slide.title}</div>
                  <div className="text-xs text-zinc-400 mt-1 line-clamp-1">{slide.desc}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href={LANDING_CONTENT.brand.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all flex items-center gap-2"
              >
                <Github size={15} />
                <span>Explore Codebase on GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Slide Interactive Canvas */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl p-4 md:p-6 flex flex-col justify-between">
              {/* Slide image preview */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slides[activeSlide].preview}
                  alt={slides[activeSlide].title}
                  className="w-full h-full object-cover filter brightness-75 contrast-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Slide Header */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-zinc-300">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                  SYSTEM BLUEPRINT • {slides[activeSlide].number} / 03
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-accent transition-colors"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-accent transition-colors"
                    aria-label="Next Slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Slide Bottom Caption */}
              <div className="relative z-10 p-4 md:p-6 bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg">
                <span className="text-xs font-mono uppercase tracking-wider text-accent block mb-1">
                  Architecture Layer {slides[activeSlide].number}
                </span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                  {slides[activeSlide].title}
                </h3>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  {slides[activeSlide].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
