import { useState } from 'react';
import { useStore } from '../store/useStore';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Persona } from '../types';
import { CheckCircle2 } from 'lucide-react';

export const ComparisonView = () => {
  const { personas } = useStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedPersonas = personas.filter((p: Persona) => selectedIds.includes(p.id));

  const radarData = [
    { trait: 'Openness', ...selectedPersonas.reduce<Record<string, number>>((acc, p: Persona) => ({ ...acc, [p.id]: p.personalityTraits?.openness || 50 }), {}) },
    { trait: 'Conscientious', ...selectedPersonas.reduce<Record<string, number>>((acc, p: Persona) => ({ ...acc, [p.id]: p.personalityTraits?.conscientiousness || 50 }), {}) },
    { trait: 'Extraversion', ...selectedPersonas.reduce<Record<string, number>>((acc, p: Persona) => ({ ...acc, [p.id]: p.personalityTraits?.extraversion || 50 }), {}) },
    { trait: 'Agreeableness', ...selectedPersonas.reduce<Record<string, number>>((acc, p: Persona) => ({ ...acc, [p.id]: p.personalityTraits?.agreeableness || 50 }), {}) },
    { trait: 'Neuroticism', ...selectedPersonas.reduce<Record<string, number>>((acc, p: Persona) => ({ ...acc, [p.id]: p.personalityTraits?.neuroticism || 50 }), {}) },
  ];

  const colors = ['var(--accent)', '#22c55e', '#f59e0b'];

  if (personas.length < 2) {
    return (
      <div className="card p-12 text-center">
        <p className="text-[var(--text-secondary)]">Create at least 2 personas to compare them</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[var(--text)]">Compare Personas</h1>
        <p className="text-[var(--text-secondary)] mt-1">Select up to 3 personas to compare their personality traits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map((persona: Persona) => (
          <button
            key={persona.id}
            onClick={() => toggleSelection(persona.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedIds.includes(persona.id)
                ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white font-bold">
                {persona.name?.charAt(0) || '?'}
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-[var(--text)]">{persona.name || 'Unnamed'}</p>
                <p className="text-sm text-[var(--text-secondary)]">{persona.role || 'No role'}</p>
              </div>
              {selectedIds.includes(persona.id) && (
                <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedPersonas.length > 0 && (
        <div className="card p-6 space-y-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text)]">Personality Comparison</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Radar name={selectedPersonas[0]?.name || 'Persona 1'} dataKey={selectedPersonas[0]?.id} stroke={colors[0]} fill={colors[0]} fillOpacity={0.3} />
                {selectedPersonas[1] && (
                  <Radar name={selectedPersonas[1]?.name || 'Persona 2'} dataKey={selectedPersonas[1]?.id} stroke={colors[1]} fill={colors[1]} fillOpacity={0.3} />
                )}
                {selectedPersonas[2] && (
                  <Radar name={selectedPersonas[2]?.name || 'Persona 3'} dataKey={selectedPersonas[2]?.id} stroke={colors[2]} fill={colors[2]} fillOpacity={0.3} />
                )}
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedPersonas.map((persona: Persona, idx: number) => (
              <div key={persona.id} className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                  <h3 className="font-medium text-[var(--text)]">{persona.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">Goals:</span> <span className="text-[var(--text)]">{persona.goals?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Pain Points:</span> <span className="text-[var(--text)]">{persona.painPoints?.length || 0}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[var(--text-secondary)]">Channels:</span> <span className="text-[var(--text)]">{persona.preferredChannels?.join(', ') || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Tech Savvy:</span> <span className="text-[var(--text)]">{persona.techSavvy || 50}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};