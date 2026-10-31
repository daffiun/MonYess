import { LANDING_CONTENT } from '../content';

export default function WhoWeAreSection() {
  const { whoWeAre } = LANDING_CONTENT;

  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="eyebrow-badge mb-4">[ Who We Are • Philosophy ]</div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase leading-[0.95]">
            {whoWeAre.headline}
          </h2>
          <p className="mt-6 text-zinc-300 text-lg md:text-xl font-light font-sans leading-relaxed">
            {whoWeAre.body}
          </p>
        </div>

        {/* 3-Image Collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Image 1 */}
          <div className="md:col-span-5 aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 group">
            <img
              src={whoWeAre.images[0]}
              alt="Design strategy session"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
            />
          </div>

          {/* Image 2 (Hero center) */}
          <div className="md:col-span-4 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-accent/40 bg-zinc-900 group shadow-2xl">
            <img
              src={whoWeAre.images[1]}
              alt="Engineering sprint"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Image 3 */}
          <div className="md:col-span-3 aspect-square rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 group">
            <img
              src={whoWeAre.images[2]}
              alt="Creative studio atmosphere"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
            />
          </div>
        </div>

        {/* Squad Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-10 text-xs font-mono">
          <div>
            <span className="text-zinc-500 uppercase block">CORE SQUAD</span>
            <span className="text-white text-lg font-bold font-display mt-1 block">24 MAKERS</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block">AVERAGE TENURE</span>
            <span className="text-white text-lg font-bold font-display mt-1 block">7+ YEARS EXP</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block">ACCOUNT MANAGERS</span>
            <span className="text-accent text-lg font-bold font-display mt-1 block">ZERO FLUFF</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block">TIMEZONES COVERED</span>
            <span className="text-white text-lg font-bold font-display mt-1 block">CET & WIB (24H)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
