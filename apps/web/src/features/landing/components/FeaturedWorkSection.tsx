import { useState } from 'react';
import { ArrowUpRight, Plus, Trophy, Sparkles } from 'lucide-react';
import { LANDING_CONTENT, Project } from '../content';

export default function FeaturedWorkSection() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <section id="work" className="py-32 px-6 md:px-12 bg-[#09090c] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="eyebrow-badge mb-4">[ Featured Work • 2024 / 2025 ]</div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
              SELECTED CASES.
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base font-sans">
            A curated collection of digital flagships, high-velocity FinTech interfaces, and multi-sensory brand worlds.
          </p>
        </div>

        {/* Project Grid / Stacked Cards */}
        <div className="space-y-24 md:space-y-36">
          {LANDING_CONTENT.featuredWork.map((project: Project, idx: number) => {
            const isEven = idx % 2 === 0;

            return (
              <article
                key={project.id}
                data-cursor="VIEW"
                className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center"
              >
                {/* Media Container (Landscape or Portrait) */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/15 bg-zinc-900 shadow-2xl group-hover:border-accent/60 transition-all duration-500">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 contrast-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                    {/* Award Chip */}
                    {project.award && (
                      <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono text-accent flex items-center gap-1.5">
                        <Trophy size={12} />
                        <span>{project.award}</span>
                      </div>
                    )}

                    {/* Year badge */}
                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono text-zinc-300">
                      {project.year}
                    </div>

                    {/* Hover Explore Pill */}
                    <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <span>View Case</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>

                {/* Content Container */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  } space-y-6`}
                >
                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 bg-white/5 text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                      0{idx + 1} / {project.client}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-zinc-400 font-sans leading-relaxed text-sm md:text-base">
                    {project.description}
                  </p>

                  <div className="pt-2">
                    <a
                      href={project.link}
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white border-b-2 border-accent pb-1 group-hover:text-accent group-hover:border-white transition-all"
                    >
                      <span>Explore Case Study</span>
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom ( + ) All Work CTA */}
        <div className="mt-28 text-center">
          <a
            href="#work"
            className="inline-flex items-center gap-3 px-8 py-5 rounded-full border-2 border-white/20 hover:border-accent bg-black text-white hover:text-accent font-display font-extrabold text-lg uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:scale-105"
          >
            <Plus size={20} className="text-accent" />
            <span>( + ) All Archive & Case Studies</span>
          </a>
        </div>
      </div>
    </section>
  );
}
