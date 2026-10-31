import { useState } from 'react';
import { ArrowUpRight, Github, Send } from 'lucide-react';
import { LANDING_CONTENT, ServiceCategory } from '../content';

export default function WhatWeDoSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(1);
  const categories = LANDING_CONTENT.whatWeDo;

  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <div className="eyebrow-badge mb-4">[ System Capabilities • 3 Core Pillars ]</div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
            THREE PILLARS OF MONYESS.
          </h2>
          <p className="mt-4 text-zinc-400 font-sans text-sm md:text-base leading-relaxed">
            From zero-friction conversational logging to high-clarity financial analytics and dopamine-driven habit gamification.
          </p>
        </div>

        {/* 3 Columns with Dynamic Hover Image */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat: ServiceCategory, idx: number) => {
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`relative rounded-3xl border p-8 md:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden ${
                  isHovered
                    ? 'border-accent bg-zinc-900/90 shadow-[0_0_40px_rgba(204,255,0,0.15)] scale-[1.02]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Background image preview revealed on hover */}
                <div
                  className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
                    isHovered ? 'opacity-20' : 'opacity-0'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover filter grayscale contrast-125 scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* Top Info */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">
                    <span className={isHovered ? 'text-accent font-bold' : ''}>
                      [ 0{idx + 1} / PILLAR ]
                    </span>
                    <ArrowUpRight
                      size={18}
                      className={`transition-transform duration-300 ${
                        isHovered ? 'text-accent translate-x-1 -translate-y-1' : 'text-zinc-600'
                      }`}
                    />
                  </div>

                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                    {cat.name}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed min-h-[40px]">
                    {cat.tagline}
                  </p>
                </div>

                {/* Services List */}
                <ul className="relative z-10 mt-8 space-y-3 border-t border-white/10 pt-6">
                  {cat.services.map((service, sIdx) => (
                    <li
                      key={sIdx}
                      className="text-xs md:text-sm text-zinc-300 flex items-center gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* TLDR hotline with developer info */}
        <div className="mt-16 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt="Daffi Ahmad"
              className="w-14 h-14 rounded-full object-cover border-2 border-accent shadow-[0_0_15px_#CCFF00]"
            />
            <div>
              <p className="text-sm md:text-base font-bold text-white">
                TL;DR — MonYess tracks your money so you don't have to.
              </p>
              <p className="text-xs font-mono text-zinc-400">
                Open source portfolio architecture • Built solo by Daffi Ahmad
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://t.me/monyess_bot"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/20 hover:border-accent text-white hover:text-accent font-mono font-bold text-xs tracking-wider transition-all duration-300"
            >
              <Send size={14} />
              <span>@monyess_bot</span>
            </a>
            <a
              href="https://github.com/daffiahmad"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent hover:bg-white text-black font-mono font-bold text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.4)]"
            >
              <Github size={15} />
              <span>Explore GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
