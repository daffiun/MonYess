import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  'Website & Creative Web',
  'Brand Identity & Strategy',
  'FinTech Platform & App',
  'E-commerce & Headless',
  'Telegram Bot System',
  'Design System at Scale',
];

const BUDGET_RANGES = [
  '€10k – €25k',
  '€25k – €50k',
  '€50k – €100k',
  '€100k+',
];

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    if (errors.types) {
      setErrors((prev) => ({ ...prev, types: '' }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedTypes.length === 0) {
        setErrors({ types: 'Please pick at least one project discipline.' });
        return;
      }
      setErrors({});
      setStep(2);
    }
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Your name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please tell us a little bit about your project or vision.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Simulate submission to lead pipeline
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Success step
    }, 900);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedTypes([]);
    setFormData({ name: '', email: '', company: '', message: '' });
    setErrors({});
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#0f0f13] border border-white/15 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div className="text-xs font-mono text-accent uppercase tracking-widest">
              [ Start a project • Step 0{step} / 02 ]
            </div>
            <h2 className="text-2xl font-display font-bold text-white mt-1">
              {step === 1 && "What are we building together?"}
              {step === 2 && "Tell us about your team & vision"}
              {step === 3 && "High five!"}
            </h2>
          </div>

          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Project Type & Scope */}
        {step === 1 && (
          <div className="py-6 space-y-6">
            <p className="text-sm text-zinc-400">
              Select all categories that apply to your project. We assemble custom squads based on scope.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`text-left p-4 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-white shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{type}</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-accent bg-accent' : 'border-white/30'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.types && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle size={14} /> {errors.types}
              </p>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Estimated Investment Budget
              </label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
                      budget === b
                        ? 'border-accent bg-accent text-black font-bold'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a
                href="#contact"
                onClick={onClose}
                className="text-xs font-mono text-zinc-400 hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                <Calendar size={14} /> Or schedule an intro call
              </a>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full bg-accent text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all"
                >
                  Next Step <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Client Info & Project Brief */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="maya@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Company / Venture (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Studio"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                What should we know about the project? *
              </label>
              <textarea
                rows={3}
                placeholder="Timeline, challenges, core aspirations, links to existing materials..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent resize-none"
              />
              {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
            </div>

            {submitError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle size={14} /> {submitError}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Project Brief →'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success State */}
        {step === 3 && (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent text-accent flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(204,255,0,0.3)]">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-3xl font-display font-black text-white">
              You just made our day.
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Our partners will review your brief within 24 hours. We’ll get back to you with initial thoughts and a proposed kickoff date.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Back to Site
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
