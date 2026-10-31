import { LANDING_CONTENT } from '../content';

export default function IntroSection() {
  return (
    <section id="intro" className="py-28 md:py-40 px-6 md:px-12 bg-[#070708] border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="eyebrow-badge mb-6">
          {LANDING_CONTENT.intro.badge}
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[0.95] text-white">
          A creative digital agency that goes{' '}
          <span className="text-accent underline decoration-white/20 underline-offset-8">
            all in
          </span>{' '}
          or not at all.
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 text-xs font-mono text-zinc-500 uppercase tracking-widest pt-2">
            [ OUR DESIGN DOCTRINE ]
          </div>
          <div className="md:col-span-8">
            <p className="text-xl md:text-3xl text-zinc-300 font-sans font-light leading-relaxed">
              {LANDING_CONTENT.intro.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-6 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>NO CORPORATE FLUFF</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>SUB-SECOND INTERACTION</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>OBSESSIVE CRAFT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
