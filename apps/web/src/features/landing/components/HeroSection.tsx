import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowDown } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

interface HeroSectionProps {
  onOpenShowreel: () => void;
  onOpenProjectModal: () => void;
}

export default function HeroSection({ onOpenShowreel, onOpenProjectModal }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 bg-black overflow-hidden noise-overlay"
    >
      {/* Background looping video */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-35">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={LANDING_CONTENT.hero.videoPoster}
          className="w-full h-full object-cover scale-105 filter contrast-125"
        >
          <source src={LANDING_CONTENT.hero.videoPlaceholder} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      {/* Top Meta Row */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-white font-bold">{LANDING_CONTENT.brand.name}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-accent">{LANDING_CONTENT.hero.eyebrow}</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {LANDING_CONTENT.hero.meta.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-zinc-500">{item.label}:</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            GH
          </a>
          <span>•</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            IG
          </a>
          <span>•</span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            X
          </a>
        </div>
      </div>

      {/* Center Giant Editorial Headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12 md:py-20">
        <div className="inline-block eyebrow-badge mb-4 md:mb-6">
          [ 2025/2026 Creative & FinTech Direction ]
        </div>

        <h1 className="text-[12vw] sm:text-[11vw] lg:text-[10vw] font-display font-black tracking-[-0.05em] leading-[0.88] text-white uppercase select-none">
          WE SHAPE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 hover:text-accent transition-colors duration-500">
            DIGITAL
          </span>{' '}
          <span className="text-accent italic font-light hover:not-italic transition-all">
            MOMENTUM.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base md:text-lg text-zinc-300 font-sans leading-relaxed">
          Award-style digital experiences, autonomous financial bots, and obsessively crafted brand systems.
          Engineered in Amsterdam & Jakarta for teams that refuse to be boring.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenProjectModal}
            className="px-8 py-4 rounded-full bg-accent text-black font-extrabold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:scale-105 transition-all duration-300"
          >
            Start a project →
          </button>
          <a
            href="#work"
            className="px-6 py-4 rounded-full border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Explore Portfolio
          </a>
        </div>
      </div>

      {/* Bottom Showreel Controller Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono">
        {/* Clickable Showreel Capsule */}
        <div
          data-cursor="PLAY"
          onClick={onOpenShowreel}
          className="group cursor-pointer flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-accent rounded-full py-2.5 px-4 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_#CCFF00]">
            <Play size={14} fill="currentColor" className="ml-0.5" />
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold group-hover:text-accent transition-colors flex items-center gap-1.5">
              WATCH 2025 SHOWREEL
              <Maximize2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="text-zinc-500 text-[10px]">FULLSCREEN SHOWCASE • 0:00 / 1:03</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/15">
            <button
              onClick={togglePlay}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle Play"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={toggleMute}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle Mute"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Scroll anchor */}
        <a
          href="#intro"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-2"
        >
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown size={14} className="animate-bounce text-accent" />
        </a>
      </div>
    </section>
  );
}
