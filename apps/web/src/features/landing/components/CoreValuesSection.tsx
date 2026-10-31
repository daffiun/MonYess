import { useState } from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import { LANDING_CONTENT, ValueItem } from '../content';

const ICONS = [Sparkles, ShieldCheck, HeartHandshake, Zap];

export default function CoreValuesSection() {
  const [activeValue, setActiveValue] = useState(0);
  const values = LANDING_CONTENT.coreValues;

  return (
    <section id="values" className="py-32 px-6 md:px-12 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="eyebrow-badge mb-4">[ Principles • Core Values ]</div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
              WHAT DRIVES US.
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base font-sans">
            Four non-negotiable standards etched into every sprint, prototype, and product launch.
          </p>
        </div>

        {/* 4 Cards Grid / Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val: ValueItem, idx: number) => {
            const Icon = ICONS[idx % ICONS.length];
            const isSelected = activeValue === idx;

            return (
              <div
                key={val.number}
                onMouseEnter={() => setActiveValue(idx)}
                className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-accent bg-zinc-900/90 shadow-[0_0_30px_rgba(204,255,0,0.2)] scale-[1.02]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                      {val.badge}
                    </span>
                    <Icon
                      size={20}
                      className={isSelected ? 'text-accent' : 'text-zinc-600'}
                    />
                  </div>

                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                    {val.subtitle}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                    {val.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed border-t border-white/10 pt-6 mt-6">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
