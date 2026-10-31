import { LANDING_CONTENT } from '../content';

export default function OurVibeSection() {
  const { ourVibe } = LANDING_CONTENT;

  return (
    <section id="vibe" className="py-28 px-6 md:px-12 bg-[#0c0c10] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="eyebrow-badge mb-4">[ Design Vibe • Philosophy ]</div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white leading-tight">
              Obsessed with details <br />
              <span className="text-accent italic font-light">that make habits feel effortless.</span>
            </h2>
          </div>
          <p className="max-w-md text-zinc-300 font-sans text-sm md:text-base leading-relaxed">
            {ourVibe.subtitle}
          </p>
        </div>

        {/* Full-width visual banner */}
        <div className="relative aspect-[16/8] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl group">
          <img
            src={ourVibe.image}
            alt="MonYess design and engineering philosophy"
            className="w-full h-full object-cover filter contrast-125 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Floating graphic statement */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-xl">
            <span className="text-xs font-mono text-accent uppercase tracking-widest block mb-2">
              [ CRAFTED FOR DAILY HABITS ]
            </span>
            <p className="text-xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
              FINANCE DOESN'T HAVE TO BE DRY. <br />
              IT SHOULD EMPOWER YOUR DAILY FREEDOM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
