import { useEffect, useState, useRef } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // If user prefers reduced motion, skip instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCompleteRef.current();
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 8;
      if (current >= 100) {
        current = 100;
        setPercent(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          setTimeout(() => {
            onCompleteRef.current();
          }, 450);
        }, 150);
      } else {
        setPercent(current);
      }
    }, 25);

    // Safety fallback: guaranteed auto-dismiss after 1.2s max under any condition
    const safetyTimeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoaded(true);
      onCompleteRef.current();
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <div
      aria-hidden={isLoaded}
      className={`fixed inset-0 z-[1000] bg-black text-[#F5F5F7] flex flex-col justify-between p-8 md:p-14 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isLoaded ? '-translate-y-full pointer-events-none' : 'translate-y-0 pointer-events-auto'
      }`}
    >
      <div className="flex justify-between items-center text-xs uppercase tracking-widest font-mono text-zinc-500">
        <span className="text-accent flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          MONYESS • FINANCE TRACKER
        </span>
        <span>SOLO PORTFOLIO • INDONESIA 🇮🇩</span>
      </div>

      <div className="my-auto">
        <div className="text-[18vw] md:text-[14vw] font-display font-black leading-none tracking-tighter text-white flex items-baseline">
          <span>{percent.toString().padStart(2, '0')}</span>
          <span className="text-accent text-[8vw] md:text-[5vw] ml-2">%</span>
        </div>
        <p className="font-mono text-sm uppercase tracking-widest text-zinc-400 mt-2">
          [ Initializing financial telemetry & gamified engine ]
        </p>
      </div>

      <div className="flex justify-between items-end border-t border-zinc-800 pt-6 text-xs font-mono text-zinc-500">
        <span>TRACK SMARTER. SPEND WISER.</span>
        <span>© {new Date().getFullYear()} DAFFI AHMAD</span>
      </div>
    </div>
  );
}
