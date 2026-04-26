import { AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface CompletenessIndicatorProps {
  score: number;
  missing: string[];
}

export const CompletenessIndicator = ({ score, missing }: CompletenessIndicatorProps) => {
  const getColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBgColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-secondary)]">Completeness</span>
        <span className={`text-lg font-bold ${getColor()}`}>{score}%</span>
      </div>
      
      <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          className={`h-full ${getBgColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {missing.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Missing fields:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 5).map((field) => (
              <span
                key={field}
                className="px-2 py-0.5 text-xs bg-red-500/10 text-red-500 rounded-full"
              >
                {field}
              </span>
            ))}
            {missing.length > 5 && (
              <span className="px-2 py-0.5 text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full">
                +{missing.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {score >= 80 && (
        <div className="flex items-center gap-2 text-xs text-green-500">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Persona is ready for use</span>
        </div>
      )}

      {score < 50 && (
        <div className="flex items-center gap-2 text-xs text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI suggestions available to help fill missing fields</span>
        </div>
      )}
    </div>
  );
};

interface SuggestionChipProps {
  suggestion: string;
  onClick: () => void;
}

export const SuggestionChip = ({ suggestion, onClick }: SuggestionChipProps) => {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-xs bg-[var(--accent)]/10 text-[var(--accent)] rounded-full hover:bg-[var(--accent)]/20 transition-colors flex items-center gap-1.5"
    >
      <Sparkles className="w-3 h-3" />
      {suggestion}
    </button>
  );
};