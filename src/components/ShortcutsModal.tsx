import { X } from 'lucide-react';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--bg)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-xl font-semibold text-[var(--text)] mb-4">Keyboard Shortcuts</h2>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
            >
              <span className="text-sm text-[var(--text-secondary)]">{shortcut.action}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-[var(--bg-secondary)] text-[var(--text)] rounded border border-[var(--border)]">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--text-secondary)] mt-4 text-center">
          Press <kbd className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded text-[var(--text)]">?</kbd> to close this modal
        </p>
      </div>
    </div>
  );
};