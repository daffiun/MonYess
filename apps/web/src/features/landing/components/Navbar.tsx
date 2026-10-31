import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenProjectModal: () => void;
}

export default function Navbar({ onOpenProjectModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'ID'>('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-[#070708]/85 backdrop-blur-md border-b border-white/10 shadow-2xl'
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 font-display font-black text-xl md:text-2xl tracking-tighter text-white"
          >
            <span>MONYESS</span>
            <span className="w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300 shadow-[0_0_8px_#CCFF00]" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a
              href="#work"
              className="relative overflow-hidden group py-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Work</span>
              <span className="absolute top-full left-0 block text-accent font-semibold transition-transform duration-300 group-hover:-translate-y-full">
                Work
              </span>
            </a>

            {/* Dropdown: What we do */}
            <div
              className="relative py-1"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
                aria-expanded={dropdownOpen}
              >
                <span>What we do</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-accent' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-[#141418] border border-white/15 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <a
                    href="#services"
                    className="block p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="text-white text-xs font-mono uppercase tracking-wider text-accent mb-0.5">01 / Identity</div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">Branding & Strategy</div>
                  </a>
                  <a
                    href="#services"
                    className="block p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="text-white text-xs font-mono uppercase tracking-wider text-accent mb-0.5">02 / Engineering</div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">Digital & FinTech</div>
                  </a>
                  <a
                    href="#services"
                    className="block p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="text-white text-xs font-mono uppercase tracking-wider text-accent mb-0.5">03 / Traction</div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">Marketing & Scale</div>
                  </a>
                </div>
              )}
            </div>

            <a
              href="#about"
              className="relative overflow-hidden group py-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">About us</span>
              <span className="absolute top-full left-0 block text-accent font-semibold transition-transform duration-300 group-hover:-translate-y-full">
                About us
              </span>
            </a>

            <a
              href="#culture"
              className="relative overflow-hidden group py-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Culture</span>
              <span className="absolute top-full left-0 block text-accent font-semibold transition-transform duration-300 group-hover:-translate-y-full">
                Culture
              </span>
            </a>

            <a
              href="#contact"
              className="relative overflow-hidden group py-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Contact</span>
              <span className="absolute top-full left-0 block text-accent font-semibold transition-transform duration-300 group-hover:-translate-y-full">
                Contact
              </span>
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Language switch */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 text-xs font-mono">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'EN' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ID')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'ID' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                ID
              </button>
            </div>

            {/* Launch MonYess App link */}
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>App</span>
              <ArrowUpRight size={14} />
            </Link>

            {/* CTA with Roll-over animation */}
            <button
              onClick={onOpenProjectModal}
              className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-accent text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all duration-300"
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[150%]">
                Start a project
              </div>
              <div className="absolute inset-0 z-10 flex items-center justify-center translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 text-black">
                Let's talk →
              </div>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-3">
            <button
              onClick={onOpenProjectModal}
              className="px-3.5 py-1.5 rounded-full bg-accent text-black font-bold text-xs uppercase tracking-wider"
            >
              Let's talk
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#070708] flex flex-col justify-between p-8 pt-28 animate-in fade-in duration-300 sm:hidden">
          <div className="space-y-6">
            <div className="text-xs font-mono text-accent uppercase tracking-widest">[ Navigation ]</div>
            <div className="flex flex-col gap-4 text-3xl font-display font-bold">
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent transition-colors"
              >
                Work
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent transition-colors"
              >
                What we do
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent transition-colors"
              >
                About us
              </a>
              <a
                href="#culture"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent transition-colors"
              >
                Culture
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>LANGUAGE</span>
              <div className="flex gap-2 font-bold text-white">
                <span className={language === 'EN' ? 'text-accent' : ''} onClick={() => setLanguage('EN')}>EN</span>
                <span>/</span>
                <span className={language === 'ID' ? 'text-accent' : ''} onClick={() => setLanguage('ID')}>ID</span>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-3.5 rounded-xl border border-white/20 text-white font-bold text-center block text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch MonYess App →
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProjectModal();
              }}
              className="w-full py-4 rounded-xl bg-accent text-black font-extrabold text-center block text-sm shadow-[0_0_20px_rgba(204,255,0,0.4)]"
            >
              Start a project
            </button>
          </div>
        </div>
      )}
    </>
  );
}
