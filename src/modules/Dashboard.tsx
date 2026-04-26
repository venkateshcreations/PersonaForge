import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Plus, Copy, Trash2, Target, AlertCircle, Share2, Users, Play, Download, Filter } from 'lucide-react';

export const Dashboard = () => {
  const { personas, deletePersona, duplicatePersona, setActivePersona, addToTeam, getShareableLink, showToast, exportAll, setFilterTag, filterTag } = useStore();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleOpen = (id: string) => {
    setActivePersona(id);
    navigate('/builder');
  };

  const allTags = useMemo(() => [...new Set(personas.flatMap(p => p.tags || []))], [personas]);
  const filteredPersonas = useMemo(() => filterTag 
    ? personas.filter(p => (p.tags || []).includes(filterTag))
    : personas, [personas, filterTag]);

  const handleExportAll = () => {
    const data = exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personas-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${personas.length} personas!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--text)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your persona profiles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportAll} disabled={personas.length === 0} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All ({personas.length})
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter {filterTag ? `(${filterTag})` : ''}
          </button>
          {filterTag && (
            <button onClick={() => setFilterTag(null)} className="text-sm text-[var(--accent)] hover:underline">
              Clear
            </button>
          )}
          <button onClick={() => navigate('/builder')} className="btn-primary flex items-center gap-2 shadow-lg shadow-[var(--accent)]/15">
            <Plus className="w-4 h-4" />
            New Persona
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card p-4 flex flex-wrap gap-2">
          <span className="text-sm text-[var(--text-secondary)]">Filter by tag:</span>
          {allTags.length === 0 ? (
            <span className="text-sm text-[var(--text-secondary)]">No tags yet</span>
          ) : (
            allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                className={`px-2 py-1 rounded-full text-sm ${tag === filterTag ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] hover:bg-[var(--border)]'}`}
              >
                {tag}
              </button>
            ))
          )}
        </div>
      )}

      {personas.length === 0 ? (
        <div className="card p-12 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-2">No personas yet</h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">Create your first persona to get started with your user research</p>
          <button onClick={() => navigate('/builder')} className="btn-primary">
            Create Persona
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPersonas.map((persona, index) => (
            <div key={persona.id} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#00C2FF] flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg shadow-[var(--accent)]/20">
                  {persona.avatar ? (
                    <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
                  ) : (persona.name?.charAt(0) || '?')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text)] truncate">{persona.name || 'Unnamed'}</h3>
                  <p className="text-sm text-[var(--text-secondary)] truncate">{persona.role || 'No role'}</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-[var(--text-secondary)] mb-4">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-green-500" /> {persona.goals?.length || 0} goals
                </span>
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" /> {persona.painPoints?.length || 0} pain points
                </span>
              </div>
              {(persona.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {(persona.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                <button onClick={() => handleOpen(persona.id)} className="flex-1 btn-primary text-sm py-2">Edit</button>
                <button onClick={() => navigate(`/present/${persona.id}`)} className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:text-[var(--accent)]">
                  <Play className="w-4 h-4" />
                </button>
                <button onClick={() => { addToTeam(persona); navigate('/team'); }} className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:text-[var(--accent)]">
                  <Users className="w-4 h-4" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(getShareableLink(persona.id)); showToast('Link copied!'); }} className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:text-[var(--text)]">
                  <Share2 className="w-4 h-4" />
                </button>
                <button onClick={() => { duplicatePersona(persona.id); showToast('Duplicated!'); }} className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:text-[var(--text)]">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm('Delete?')) { deletePersona(persona.id); showToast('Deleted!'); }}} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};