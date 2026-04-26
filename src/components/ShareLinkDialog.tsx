import { useState } from 'react';
import { Copy, Check, X, Lock } from 'lucide-react';

interface ShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  getLink: () => string;
  hasPassword: boolean;
}

export const ShareLinkDialog = ({ isOpen, onClose, getLink, hasPassword }: ShareLinkDialogProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const link = getLink();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--bg)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-xl font-semibold text-[var(--text)] mb-2">Share Persona</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          Share this link with stakeholders to let them view this persona.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Shareable Link</p>
              <p className="text-sm text-[var(--text)] truncate font-mono">{link}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-xl transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-[var(--accent)] text-white hover:opacity-90'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {hasPassword && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Lock className="w-4 h-4" />
              <span>This link is password protected</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 btn-secondary">
              Close
            </button>
            <button onClick={handleCopy} className="flex-1 btn-primary">
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};