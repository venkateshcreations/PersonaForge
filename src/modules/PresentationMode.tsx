import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowRight, Target, AlertCircle, Heart, Zap, Quote } from 'lucide-react';

export const PresentationMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { personas, teamLibrary } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const allPersonas = [...personas, ...teamLibrary];
  const currentPersona = allPersonas.find((p) => p.id === id) || allPersonas[0];

  useKeyboardNavigation({
    onNext: () => {
      if (currentIndex < allPersonas.length - 1) {
        setCurrentIndex(currentIndex + 1);
        navigate(`/present/${allPersonas[currentIndex + 1].id}`);
      }
    },
    onPrev: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        navigate(`/present/${allPersonas[currentIndex - 1].id}`);
      }
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    if (id) {
      const idx = allPersonas.findIndex((p) => p.id === id);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [id]);

  if (!currentPersona) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-[var(--text)] mb-4">No personas to present</h1>
          <button onClick={() => navigate('/')} className="btn-primary">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[var(--bg-secondary)] to-[var(--bg)] animate-fade-in">
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[var(--bg)] to-transparent">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-secondary)]">
            {currentIndex + 1} of {allPersonas.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => currentIndex > 0 && navigate(`/present/${allPersonas[currentIndex - 1].id}`)}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => currentIndex < allPersonas.length - 1 && navigate(`/present/${allPersonas[currentIndex + 1].id}`)}
              disabled={currentIndex === allPersonas.length - 1}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="card p-8 md:p-12 animate-scale-in">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[#00C2FF] flex items-center justify-center text-white text-4xl md:text-5xl font-bold overflow-hidden shadow-xl shadow-[var(--accent)]/20">
              {currentPersona.avatar ? (
                <img src={currentPersona.avatar} alt={currentPersona.name} className="w-full h-full object-cover" />
              ) : (
                currentPersona.name?.charAt(0) || '?'
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text)]">{currentPersona.name}</h1>
              <p className="text-xl text-[var(--text-secondary)]">{currentPersona.role}</p>
            </div>
          </div>

          {currentPersona.quote && (
            <div className="mb-8 p-5 bg-[var(--accent)]/5 rounded-2xl border-l-4 border-[var(--accent)] animate-fade-in-up">
              <Quote className="w-6 h-6 text-[var(--accent)] mb-2" />
              <p className="text-lg text-[var(--text)] italic">"{currentPersona.quote}"</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Age</p>
              <p className="font-semibold text-[var(--text)]">{currentPersona.demographics.age || '-'}</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Location</p>
              <p className="font-semibold text-[var(--text)]">{currentPersona.demographics.location || '-'}</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Income</p>
              <p className="font-semibold text-[var(--text)]">{currentPersona.demographics.income || '-'}</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Education</p>
              <p className="font-semibold text-[var(--text)]">{currentPersona.demographics.education || '-'}</p>
            </div>
          </div>

          {currentPersona.background && (
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">Background</h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{currentPersona.background}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Goals
              </h2>
              <ul className="space-y-3">
                {currentPersona.goals?.length > 0 ? (
                  currentPersona.goals.map((goal, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span>{goal}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)]">No goals defined</p>
                )}
              </ul>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Pain Points
              </h2>
              <ul className="space-y-3">
                {currentPersona.painPoints?.length > 0 ? (
                  currentPersona.painPoints.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>{point}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)]">No pain points defined</p>
                )}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Motivations
              </h2>
              <ul className="space-y-3">
                {currentPersona.motivations?.length > 0 ? (
                  currentPersona.motivations.map((m, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>{m}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)]">No motivations defined</p>
                )}
              </ul>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Behaviors
              </h2>
              <ul className="space-y-3">
                {currentPersona.behaviors?.length > 0 ? (
                  currentPersona.behaviors.map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>{b}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)]">No behaviors defined</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full">
        <p className="text-xs text-[var(--text-secondary)]">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[var(--text)]">←</kbd> <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[var(--text)]">→</kbd> to navigate • <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[var(--text)]">Esc</kbd> to exit
        </p>
      </div>
    </div>
  );
};