import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { Persona } from '../types';
import { MapPin, DollarSign, GraduationCap, Target, AlertTriangle, Heart, Activity, MessageCircle, Phone, Award, Sparkles } from 'lucide-react';

interface Props {
  persona: Persona;
}

export const PersonaPreview = ({ persona }: Props) => {
  const radarData = [
    { trait: 'Openness', value: persona.personalityTraits?.openness || 50 },
    { trait: 'Conscientious', value: persona.personalityTraits?.conscientiousness || 50 },
    { trait: 'Extraversion', value: persona.personalityTraits?.extraversion || 50 },
    { trait: 'Agreeableness', value: persona.personalityTraits?.agreeableness || 50 },
    { trait: 'Neuroticism', value: persona.personalityTraits?.neuroticism || 50 },
  ];

  const StatItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    value && (
      <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
        <p className="font-medium text-[var(--text)]">{value}</p>
      </div>
    )
  );

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#00C2FF] flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg shadow-[var(--accent)]/20">
          {persona.avatar ? (
            <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
          ) : (
            persona.name?.charAt(0) || '?'
          )}
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--text)]">{persona.name || 'New Persona'}</h2>
          <p className="text-[var(--text-secondary)]">{persona.role || 'Role not set'}</p>
        </div>
      </div>

      {persona.quote && (
        <blockquote className="border-l-4 border-[var(--accent)] pl-4 italic text-[var(--text-secondary)]">
          "{persona.quote}"
        </blockquote>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatItem icon={null} label="Age" value={persona.demographics?.age} />
        <StatItem icon={MapPin} label="Location" value={persona.demographics?.location} />
        <StatItem icon={DollarSign} label="Income" value={persona.demographics?.income} />
        <StatItem icon={GraduationCap} label="Education" value={persona.demographics?.education} />
      </div>

      {persona.background && (
        <div>
          <h3 className="font-display text-sm font-semibold text-[var(--text)] mb-2">Background</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{persona.background}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
            <Target className="w-4 h-4" /> Goals
          </h3>
          <ul className="space-y-2">
            {(persona.goals || []).map((goal, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span> {goal}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
            <AlertTriangle className="w-4 h-4" /> Pain Points
          </h3>
          <ul className="space-y-2">
            {(persona.painPoints || []).map((pain, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-red-500 mt-0.5">!</span> {pain}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <Heart className="w-4 h-4" /> Motivations
          </h3>
          <ul className="space-y-2">
            {(persona.motivations || []).map((mot, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">★</span> {mot}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
            <Activity className="w-4 h-4" /> Behaviors
          </h3>
          <ul className="space-y-2">
            {(persona.behaviors || []).map((beh, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">●</span> {beh}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" /> Personality Radar
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="trait" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Radar name="Personality" dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {persona.communicationStyle && (
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Communication Style</p>
            <p className="font-medium text-[var(--text)]">{persona.communicationStyle}</p>
          </div>
        )}
        {persona.preferredTone && (
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Preferred Tone</p>
            <p className="font-medium text-[var(--text)]">{persona.preferredTone}</p>
          </div>
        )}
        {persona.techSavvy !== undefined && (
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg col-span-2">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Tech Savvy</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style={{ width: `${persona.techSavvy}%` }} />
              </div>
              <span className="text-sm font-semibold text-[var(--text)]">{persona.techSavvy}%</span>
            </div>
          </div>
        )}
      </div>

      {persona.preferredChannels?.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
            <MessageCircle className="w-4 h-4" /> Preferred Channels
          </h3>
          <div className="flex flex-wrap gap-2">
            {(persona.preferredChannels || []).map((ch, i) => (
              <span key={i} className="chip chip-blue">{ch}</span>
            ))}
          </div>
        </div>
      )}

      {persona.brandValues?.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
            <Award className="w-4 h-4" /> Brand Values
          </h3>
          <div className="flex flex-wrap gap-2">
            {(persona.brandValues || []).map((val, i) => (
              <span key={i} className="chip chip-amber">{val}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};