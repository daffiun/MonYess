import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenProjectModal: () => void;
}

const NAV_LINKS = [
  { label: 'Features', href: '#work' },
  { label: 'Architecture', href: '#deck' },
  { label: 'About', href: '#about' },
  { label: 'Specs', href: '#awards' },
  { label: 'Contact', href: '#contact' },
];

const CAPABILITIES = [
  {
    num: '01',
    category: 'Core Ledger',
    title: 'Financial Core',
    desc: 'Accounts, categories, and cash flow telemetry',
  },
  {
    num: '02',
    category: 'Conversational',
    title: 'Telegram Bot',
    desc: 'Instant NLP transaction entry under 2 seconds',
  },
  {
    num: '03',
    category: 'Behavioral',
    title: 'Habit Engine',
    desc: 'Dopamine-driven XP, streaks, and milestone badges',
  },
];

export default function Navbar({ onOpenProjectModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized, throttled scroll listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial position
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
          isScrolled
            ? 'bg-[#070708]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-4'
            : 'bg-transparent border-b border-transparent py-5 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 font-display font-black text-xl md:text-2xl tracking-tighter text-white select-none"
          >
            <span className="transition-colors duration-200 group-hover:text-accent">
              MONYESS
            </span>
            <span className="w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_#CCFF00]" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {/* Features link */}
            <a
              href="#work"
              className="relative overflow-hidden group py-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                Features
              </span>
              <span className="absolute top-full left-0 block text-accent font-semibold transition-transform duration-300 ease-out group-hover:-translate-y-full">
                Features
              </span>
            </a>

            {/* Dropdown: Capabilities with bridge buffer to prevent flicker */}
            <div
              className="relative py-1"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors py-1"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <span>Capabilities</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ease-out ${
                    dropdownOpen ? 'rotate-180 text-accent' : 'text-zinc-500'
                  }`}
                />
              </button>

              {/* Invisible mouse bridge */}
              <div
                className={`absolute top-full left-0 w-72 h-3 pointer-events-auto ${
                  dropdownOpen ? 'block' : 'hidden'
                }`}
              />

              {/* Dropdown Popover */}
              <div
                className={`absolute top-full left-0 mt-2 w-72 bg-[#121216]/95 border border-white/15 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-200 origin-top-left ${
                  dropdownOpen
                    ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                    : 'opacity-0 scale-95 pointer-events-none -translate-y-2'
                }`}
              >
                <div className="space-y-1">
                  {CAPABILITIES.map((cap) => (
                    <a
                      key={cap.num}
                      href="#services"
                      onClick={() => setDropdownOpen(false)}
                      className="block p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-0.5">
                        {cap.num} / {cap.category}
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                        {cap.title}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        {cap.desc}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Standard Nav Links with smooth rollover */}
            {NAV_LINKS.slice(1).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative overflow-hidden group py-1 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  {item.label}
                </span>
                <span className="absolute top-full left-0 block text-accent font-semibold transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Launch App Pill */}
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowUpRight size={13} className="text-accent" />
            </Link>

            {/* Main CTA with smooth text roll */}
            <button
              onClick={onOpenProjectModal}
              className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_24px_rgba(204,255,0,0.5)] transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative z-10 transition-transform duration-300 ease-out group-hover:-translate-y-[150%]">
                Collaborate
              </div>
              <div className="absolute inset-0 z-10 flex items-center justify-center translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 ease-out text-black font-extrabold">
                Let's talk →
              </div>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-3">
            <button
              onClick={onOpenProjectModal}
              className="px-3.5 py-1.5 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider"
            >
              Let's talk
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#070708]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 sm:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        <div className="space-y-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest">[ Navigation ]</div>
          <div className="flex flex-col gap-5 text-3xl font-display font-bold">
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-accent transition-colors"
            >
              Features
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-accent transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#deck"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-accent transition-colors"
            >
              Architecture
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-accent transition-colors"
            >
              About
            </a>
            <a
              href="#awards"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-accent transition-colors"
            >
              Specs
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
          <Link
            to="/login"
            className="w-full py-3.5 rounded-xl border border-white/20 text-white font-bold text-center block text-sm hover:border-accent hover:text-accent transition-colors"
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
            Get In Touch
          </button>
        </div>
      </div>
    </>
  );
}
