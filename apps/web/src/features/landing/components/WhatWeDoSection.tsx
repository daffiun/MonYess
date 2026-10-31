import { useState } from 'react';
import { Phone, ArrowUpRight, Check } from 'lucide-react';
import { LANDING_CONTENT, ServiceCategory } from '../content';

export default function WhatWeDoSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(1);
  const categories = LANDING_CONTENT.whatWeDo;

  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <div className="eyebrow-badge mb-4">[ What We Do • Core Capabilities ]</div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
            FULL SPECTRUM DIGITAL.
          </h2>
          <p className="mt-4 text-zinc-400 font-sans text-sm md:text-base leading-relaxed">
            From the initial spark of brand positioning to high-concurrency FinTech architectures and viral gamification loops.
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
                      [ 0{idx + 1} / DISCIPLINE ]
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

        {/* TLDR hotline with team member avatar */}
        <div className="mt-16 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt="MonYess Partner"
              className="w-14 h-14 rounded-full object-cover border-2 border-accent shadow-[0_0_15px_#CCFF00]"
            />
            <div>
              <p className="text-sm md:text-base font-bold text-white">
                TLDR; we do a lot. Just give us a call:
              </p>
              <p className="text-xs font-mono text-zinc-400">
                Direct partner line • Amsterdam & Jakarta timezones
              </p>
            </div>
          </div>

          <a
            href={`tel:${LANDING_CONTENT.brand.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-accent hover:bg-white text-black font-mono font-bold text-sm tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.4)]"
          >
            <Phone size={16} />
            <span>{LANDING_CONTENT.brand.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
