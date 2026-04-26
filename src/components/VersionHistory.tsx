import { useState } from 'react';
import { Clock, RotateCcw, X } from 'lucide-react';
import type { Persona, PersonaVersion } from '../types';

interface VersionHistoryProps {
  persona: Persona;
  onRevert: (version: PersonaVersion) => void;
  onClose: () => void;
}

export const VersionHistory = ({ persona, onRevert, onClose }: VersionHistoryProps) => {
  const versions = (persona.versionHistory || []).slice().reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[var(--card-bg)] rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Version History
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-secondary)] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="p-3 bg-[var(--accent)]/10 rounded-lg border border-[var(--accent)]/30">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[var(--accent)]">Current Version</span>
              <span className="text-xs text-[var(--text-secondary)]">v{persona.version || 1}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Last updated: {new Date(persona.updatedAt).toLocaleString()}
            </p>
          </div>

          {versions.length === 0 ? (
            <p className="text-center text-[var(--text-secondary)] py-8">
              No previous versions yet. Versions are created when you save changes.
            </p>
          ) : (
            versions.map((v, i) => (
              <div key={v.version} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Version {v.version}</span>
                  <button
                    onClick={() => onRevert(v)}
                    className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" /> Revert
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {new Date(v.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {v.changes}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};