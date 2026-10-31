import { LANDING_CONTENT } from '../content';

export default function HappyClientsSection() {
  const clients = [...LANDING_CONTENT.clients, ...LANDING_CONTENT.clients];

  return (
    <section className="py-20 bg-[#070708] border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex items-center justify-between">
        <div className="eyebrow-badge">[ Technology Stack • Core Ecosystem ]</div>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline-block">
          POWERED BY MODERN TOOLS & RUNTIMES
        </span>
      </div>

      {/* Infinite Marquee Strip */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex w-max gap-12 md:gap-20 items-center animate-marquee group-hover:[animation-play-state:paused]">
          {clients.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-4 px-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.05] transition-all cursor-default"
            >
              <div className="w-2.5 h-2.5 rounded-sm bg-zinc-600 group-hover:bg-accent transition-colors" />
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-display font-black tracking-wider text-zinc-400 hover:text-white transition-colors uppercase whitespace-nowrap">
                  {c.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  {c.category}
                </span>
              </div>
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
