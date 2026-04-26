import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Target, AlertCircle, Heart, MessageSquare, Zap, Quote } from 'lucide-react';

export const SharedPersonaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { personas, teamLibrary, getShareableLink } = useStore();
  const [persona, setPersona] = useState<typeof personas[0] | null>(null);

  useEffect(() => {
    const found = [...personas, ...teamLibrary].find((p) => p.id === id);
    setPersona(found || null);
  }, [id, personas, teamLibrary]);

  if (!persona) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-[var(--text)] mb-4">Persona not found</h1>
          <p className="text-[var(--text-secondary)] mb-6">This shared link may be invalid or expired.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = personas.some((p) => p.id === persona.id);
  const shareLink = getShareableLink(persona.id);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => navigate(isOwner ? '/' : '/team')}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <span className="chip text-xs bg-[var(--accent)]/10 text-[var(--accent)]">View Only</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="card p-8 animate-scale-in">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#00C2FF] flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg shadow-[var(--accent)]/20">
              {persona.avatar ? (
                <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
              ) : (
                persona.name?.charAt(0) || '?'
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold text-[var(--text)]">{persona.name}</h1>
              <p className="text-[var(--text-secondary)] text-lg">{persona.role}</p>
            </div>
          </div>

          {persona.quote && (
            <div className="mb-8 p-4 bg-[var(--accent)]/5 rounded-xl border-l-4 border-[var(--accent)]">
              <Quote className="w-5 h-5 text-[var(--accent)] mb-2" />
              <p className="text-[var(--text)] italic">"{persona.quote}"</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Age</p>
              <p className="font-semibold text-[var(--text)]">{persona.demographics.age || '-'}</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Location</p>
              <p className="font-semibold text-[var(--text)]">{persona.demographics.location || '-'}</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Income</p>
              <p className="font-semibold text-[var(--text)]">{persona.demographics.income || '-'}</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Education</p>
              <p className="font-semibold text-[var(--text)]">{persona.demographics.education || '-'}</p>
            </div>
          </div>

          {persona.background && (
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">Background</h2>
              <p className="text-[var(--text-secondary)]">{persona.background}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Goals
              </h2>
              <ul className="space-y-2">
                {persona.goals?.length > 0 ? (
                  persona.goals.map((goal, i) => (
                    <li key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {goal}
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm">No goals defined</p>
                )}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Pain Points
              </h2>
              <ul className="space-y-2">
                {persona.painPoints?.length > 0 ? (
                  persona.painPoints.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {point}
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm">No pain points defined</p>
                )}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Motivations
              </h2>
              <ul className="space-y-2">
                {persona.motivations?.length > 0 ? (
                  persona.motivations.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      {m}
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm">No motivations defined</p>
                )}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Behaviors
              </h2>
              <ul className="space-y-2">
                {persona.behaviors?.length > 0 ? (
                  persona.behaviors.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      {b}
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm">No behaviors defined</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};