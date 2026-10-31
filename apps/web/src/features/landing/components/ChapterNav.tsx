import { useEffect, useState } from 'react';

const CHAPTERS = [
  { id: 'hero', label: 'Welcome' },
  { id: 'intro', label: 'Who we are' },
  { id: 'work', label: 'The Work' },
  { id: 'deck', label: 'Manifesto' },
  { id: 'services', label: 'What we do' },
  { id: 'culture', label: 'Culture' },
  { id: 'vibe', label: 'Our vibe' },
  { id: 'values', label: 'Core values' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: "Let's talk" },
];

export default function ChapterNav() {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(CHAPTERS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      aria-label="Chapter navigation"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 py-4 px-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
    >
      {CHAPTERS.map((ch) => {
        const isActive = activeId === ch.id;
        return (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            aria-label={`Jump to ${ch.label}`}
            className="group relative flex items-center justify-end p-1.5 focus:outline-none"
          >
            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute right-full mr-3.5 px-2.5 py-1 rounded-md bg-[#16161a] border border-white/15 text-[10px] font-mono uppercase tracking-wider text-white whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              {ch.label}
            </span>

            {/* Indicator pip */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-2.5 h-6 bg-accent shadow-[0_0_10px_#CCFF00]'
                  : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white group-hover:scale-125'
              }`}
            />
          </a>
        );
      })}
    </aside>
  );
}
