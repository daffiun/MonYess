import { ArrowUpRight, Compass } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

export default function CultureTeaserSection() {
  return (
    <section id="culture" className="py-32 px-6 md:px-12 bg-[#09090c] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="eyebrow-badge">[ Studio Culture & Roots ]</div>

          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-tight">
            {LANDING_CONTENT.culture.headline}
          </h2>

          <p className="text-zinc-300 font-sans leading-relaxed text-base md:text-lg font-light">
            {LANDING_CONTENT.culture.description}
          </p>

          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 text-xs font-mono space-y-2 text-zinc-400">
            <div className="flex items-center gap-2 text-accent">
              <Compass size={14} />
              <span>COORDINATES</span>
            </div>
            <div className="text-white font-medium">{LANDING_CONTENT.brand.coordinates}</div>
            <div className="text-zinc-500">{LANDING_CONTENT.brand.address}</div>
          </div>

          <div className="pt-2">
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white border-b-2 border-accent pb-1 hover:text-accent transition-colors"
            >
              <span>Explore Our Culture Manifesto</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Right Overlapping Images */}
        <div className="lg:col-span-6 relative flex justify-center py-8">
          {/* Back/Main Photo */}
          <div className="relative w-3/4 aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <img
              src={LANDING_CONTENT.culture.photos[0]}
              alt="Amsterdam studio canals"
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-xs font-mono text-zinc-300">
              [ 01 / AMSTERDAM STUDIO ]
            </div>
          </div>

          {/* Overlapping Front Photo */}
          <div className="absolute -bottom-6 -right-2 sm:right-6 w-1/2 aspect-[4/5] rounded-3xl overflow-hidden border-2 border-accent shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <img
              src={LANDING_CONTENT.culture.photos[1]}
              alt="Jakarta creative studio"
              className="w-full h-full object-cover filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-xs font-mono text-accent font-bold">
              [ 02 / JAKARTA CREATIVE ]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
