import { Sparkles } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

export default function ClientsHeartSection() {
  const partners = [...LANDING_CONTENT.impactPartners, ...LANDING_CONTENT.impactPartners];

  return (
    <section className="py-20 bg-[#070708] border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 eyebrow-badge">
          <Sparkles size={14} className="text-accent" />
          <span>[ System Features • All In One App ]</span>
        </div>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline-block">
          EVERYTHING YOU NEED TO MASTER YOUR FINANCES
        </span>
      </div>

      {/* Reverse Marquee */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex w-max gap-8 md:gap-14 items-center animate-marquee-reverse group-hover:[animation-play-state:paused]">
          {partners.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 px-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-accent/40 transition-all cursor-default"
            >
              <span className="text-base md:text-xl font-display font-black text-zinc-300 uppercase whitespace-nowrap">
                {p.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-accent">
                {p.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Gradient edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070708] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070708] to-transparent z-10" />
      </div>
    </section>
  );
}
