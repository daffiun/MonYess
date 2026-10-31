import { Trophy, ArrowUpRight } from 'lucide-react';
import { LANDING_CONTENT, AwardItem } from '../content';

export default function AwardsSection() {
  const awards = LANDING_CONTENT.awards;

  return (
    <section id="awards" className="py-32 px-6 md:px-12 bg-[#09090c] border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="eyebrow-badge mb-4">[ Recognition • Track Record ]</div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
              AWARDS & HONORS.
            </h2>
          </div>
          <p className="text-zinc-400 max-w-sm text-sm font-sans">
            Peer-reviewed accolades for digital craftsmanship, interaction design, and technical engineering.
          </p>
        </div>

        {/* Awards Table */}
        <div className="border-t border-white/15 divide-y divide-white/10">
          {awards.map((item: AwardItem, idx: number) => (
            <div
              key={idx}
              className="group py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-white/[0.03] px-4 rounded-2xl transition-all duration-200 cursor-default"
            >
              <div className="md:col-span-4 flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500">0{idx + 1}</span>
                <span className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-accent transition-colors">
                  {item.organisation}
                </span>
              </div>

              <div className="md:col-span-5 text-sm md:text-base text-zinc-300 font-sans">
                {item.award}
              </div>

              <div className="md:col-span-2 text-right md:text-center text-xs font-mono text-zinc-500">
                {item.year}
              </div>

              <div className="md:col-span-1 text-right flex items-center justify-end gap-2">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/40 text-accent font-mono font-bold text-xs">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
