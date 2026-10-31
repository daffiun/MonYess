import { LANDING_CONTENT } from '../content';

export default function WhatWeBelieveSection() {
  const { whatWeBelieve } = LANDING_CONTENT;

  return (
    <section className="py-32 px-6 md:px-12 bg-[#09090c] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Big Statement */}
        <div className="lg:col-span-7 space-y-6">
          <div className="eyebrow-badge">[ The MonYess Creed ]</div>

          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-[-0.04em] leading-[0.88] text-white uppercase">
            ALL IN <br />
            <span className="text-accent underline decoration-white/20">OR NOTHING.</span>
          </h2>

          <p className="text-lg md:text-2xl text-zinc-300 font-sans font-light leading-relaxed pt-4">
            {whatWeBelieve.paragraph}
          </p>

          <div className="pt-4 flex items-center gap-6 text-xs font-mono text-zinc-400">
            <span>[ REJECTING MEDIOCRITY SINCE 2022 ]</span>
            <span>•</span>
            <span className="text-accent">100% INDEPENDENT</span>
          </div>
        </div>

        {/* Right Art Photo */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl group">
            <img
              src={whatWeBelieve.image}
              alt="MonYess creative focus"
              className="w-full h-full object-cover filter contrast-125 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-xs font-mono text-zinc-300">
              "We commit 100% of our creative heart, or we respectfully pass."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
