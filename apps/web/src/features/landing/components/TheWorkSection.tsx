import { LANDING_CONTENT } from '../content';

export default function TheWorkSection() {
  const { theWork } = LANDING_CONTENT;

  return (
    <section className="py-28 px-6 md:px-12 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Copy */}
        <div className="max-w-xl space-y-6">
          <div className="eyebrow-badge">[ Emotional Impact ]</div>

          <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-white leading-tight">
            {theWork.headline}
          </h2>

          <p className="text-xl md:text-2xl text-accent font-display font-bold italic">
            "{theWork.subtext}"
          </p>

          <p className="text-zinc-400 font-sans text-sm md:text-base leading-relaxed">
            Logic makes people think. Emotion makes people act. When someone experiences a MonYess-crafted application or interface, they feel the rhythm, the precision, and the respect for their time.
          </p>
        </div>

        {/* Right Tall Portrait Image */}
        <div className="w-full md:w-80 lg:w-96 aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl relative group">
          <img
            src={theWork.image}
            alt="Editorial aesthetic representation"
            className="w-full h-full object-cover filter contrast-125 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-[11px] font-mono text-zinc-300">
            {theWork.caption}
          </div>
        </div>
      </div>
    </section>
  );
}
