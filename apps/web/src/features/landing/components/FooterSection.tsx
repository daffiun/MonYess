import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Github } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

export default function FooterSection() {
  const [jktTime, setJktTime] = useState('');
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setJktTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setUtcTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-[#F5F5F7] pt-28 pb-12 px-6 md:px-12 overflow-hidden border-t border-white/10 noise-overlay">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        {/* Top Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
          <div className="md:col-span-5 space-y-4">
            <div className="font-display font-black text-2xl text-white tracking-tight flex items-center gap-2">
              <span>MONYESS</span>
              <span className="w-2 h-2 rounded-full bg-accent" />
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              MonYess is a solo-crafted personal finance tracker designed for effortless Telegram logging, high-clarity analytics, and habit gamification.
            </p>
            <div className="pt-2 flex flex-col gap-1 text-xs font-mono text-zinc-500">
              <span>WIB (Jakarta): {jktTime || '--:--:--'}</span>
              <span>UTC (Global): {utcTime || '--:--:--'}</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Sitemap</span>
            <ul className="space-y-2 text-sm">
              <li><a href="#work" className="text-zinc-300 hover:text-accent transition-colors">Core Modules</a></li>
              <li><a href="#services" className="text-zinc-300 hover:text-accent transition-colors">System Pillars</a></li>
              <li><a href="#deck" className="text-zinc-300 hover:text-accent transition-colors">Architecture</a></li>
              <li><a href="#about" className="text-zinc-300 hover:text-accent transition-colors">About Builder</a></li>
              <li><a href="#awards" className="text-zinc-300 hover:text-accent transition-colors">Technical Specs</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Ecosystem</span>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-zinc-300 hover:text-accent transition-colors flex items-center gap-1">
                  <span>Launch Web App</span>
                  <ArrowUpRight size={14} />
                </Link>
              </li>
              <li>
                <a href="https://t.me/monyess_bot" target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-accent transition-colors flex items-center gap-1">
                  <span>Telegram Bot</span>
                  <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href={LANDING_CONTENT.brand.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-accent transition-colors flex items-center gap-1">
                  <span>GitHub Repository</span>
                  <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <Link to="/register" className="text-accent hover:underline transition-all">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Developer & Origin</span>
            <div className="text-xs font-mono text-zinc-400 space-y-3">
              <div>
                <span className="text-white font-bold block">DAFFI AHMAD</span>
                <span>Fullstack Software Engineer & UI/UX Designer</span>
              </div>
              <div>
                <span className="text-white font-bold block">LOCATION</span>
                <span>Indonesia 🇮🇩 • Available for Collaborations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Giant MonYess Wordmark */}
        <div className="select-none py-6 border-b border-white/10 text-center">
          <h2 className="text-[17vw] font-display font-black tracking-[-0.06em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-800 uppercase">
            MONYESS
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} DAFFI AHMAD • MONYESS</span>
            <span>•</span>
            <span>OPEN SOURCE PORTFOLIO</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors"
          >
            <span>BACK TO TOP</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
