import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-10 h-10 p-0">
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
