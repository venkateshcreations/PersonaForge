import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { validationRules, validatePersona } from '../hooks/useValidation';
import type { Persona } from '../types';

interface ExportValidationProps {
  persona: Partial<Persona>;
  onExport?: () => void;
}

export const ExportValidation = ({ persona, onExport }: ExportValidationProps) => {
  const { valid, results } = validatePersona(persona as Record<string, unknown>);
  const score = Math.round((results.filter((r) => r.passed).length / results.length) * 100);

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[var(--text)]">Export Validation</h3>
        <span className={`text-lg font-bold ${valid ? 'text-green-500' : 'text-yellow-500'}`}>
          {score}%
        </span>
      </div>

      <div className="space-y-2">
        {results.map(({ rule, passed }) => (
          <div key={rule.field} className="flex items-center justify-between text-sm">
            <span className={passed ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}>
              {rule.label}
            </span>
            {passed ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        ))}
      </div>

      {!valid && (
        <div className="flex items-center gap-2 text-xs text-yellow-500 pt-2 border-t border-[var(--border)]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Complete missing fields before export</span>
        </div>
      )}

      {valid && onExport && (
        <button onClick={onExport} className="w-full btn-primary text-sm py-2 mt-2">
          Export Ready
        </button>
      )}

      {valid && !onExport && (
        <div className="flex items-center gap-2 text-xs text-green-500 pt-2 border-t border-[var(--border)]">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Ready for export</span>
        </div>
      )}
    </div>
  );
};