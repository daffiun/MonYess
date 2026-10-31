import { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShowreelModal({ isOpen, onClose }: ShowreelModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = Math.floor(videoRef.current.currentTime);
    const mins = Math.floor(cur / 60);
    const secs = cur % 60;
    setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-black/95 flex flex-col justify-between p-6 md:p-12 animate-in fade-in duration-300"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2 text-accent">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          MONYESS SHOWREEL [ 2025/2026 EDITION ]
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Close Showreel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Video Container */}
      <div className="relative max-w-5xl mx-auto w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center my-auto">
        <video
          ref={videoRef}
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-ink-fluid-swirling-in-water-43330-large.mp4"
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Big play overlay if paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-accent text-black flex items-center justify-center shadow-[0_0_30px_#CCFF00] hover:scale-110 transition-transform"
          >
            <Play size={32} className="ml-1" fill="currentColor" />
          </button>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 text-white hover:text-accent transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 text-white hover:text-accent transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
          </button>
        </div>

        <div className="text-zinc-500">
          <span className="text-white font-bold">{currentTime}</span> / 1:03
        </div>
      </div>
    </div>
  );
}
