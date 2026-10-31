import { useState } from 'react';
import { Phone, Mail, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

interface ContactSectionProps {
  onOpenProjectModal: () => void;
}

export default function ContactSection({ onOpenProjectModal }: ContactSectionProps) {
  const [showPhonePhoto, setShowPhonePhoto] = useState(false);
  const { contact } = LANDING_CONTENT;

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-[#09090c] border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="eyebrow-badge">{contact.badge}</div>

        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-[-0.04em] leading-[0.88] text-white uppercase">
          SAY NO MORE. <br />
          <span className="text-accent underline decoration-white/20">IT'S A MATCH.</span>
        </h2>

        <p className="text-lg md:text-2xl text-zinc-300 font-sans font-light max-w-2xl leading-relaxed">
          Whether you need a high-frequency financial interface, an award-winning digital flagship, or a complete brand transformation, we’re ready to sprint.
        </p>

        {/* Interactive Phone Link with Hover Avatar */}
        <div className="relative inline-block pt-4">
          <div
            onMouseEnter={() => setShowPhonePhoto(true)}
            onMouseLeave={() => setShowPhonePhoto(false)}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center shadow-[0_0_20px_#CCFF00]">
              <Phone size={20} />
            </div>
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
                Direct hotline (hover to see who picks up)
              </span>
              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold text-white hover:text-accent transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          </div>

          {/* Hover Floating Photo */}
          {showPhonePhoto && (
            <div className="absolute -top-32 left-44 z-30 p-2 rounded-2xl bg-black border border-accent shadow-2xl animate-in zoom-in-90 duration-200 pointer-events-none">
              <img
                src={contact.phoneAvatar}
                alt="Partner direct avatar"
                className="w-24 h-24 rounded-xl object-cover"
              />
              <span className="text-[10px] font-mono text-accent text-center block mt-1 font-bold">
                Maya • Partner
              </span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="pt-8 flex flex-wrap items-center gap-4 border-t border-white/10">
          <button
            onClick={onOpenProjectModal}
            className="px-9 py-5 rounded-full bg-accent text-black font-extrabold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:scale-105 transition-all duration-300"
          >
            Start a project now →
          </button>

          <a
            href={`mailto:${contact.email}?subject=Project%20Inquiry%20via%20MonYess`}
            className="px-8 py-5 rounded-full border border-white/20 hover:border-accent text-white hover:text-accent font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Mail size={16} />
            <span>{contact.email}</span>
          </a>

          <a
            href="https://t.me/monyess_bot"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:text-white hover:bg-blue-600 font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span>Try Telegram Bot</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
