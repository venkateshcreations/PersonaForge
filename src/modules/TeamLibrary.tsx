import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Trash2, Share2, Users, Target, AlertCircle, UserPlus, X, Download, Upload, Search, Filter, Grid, List, SlidersHorizontal, Activity } from 'lucide-react';
import { ShareLinkDialog } from '../components/ShareLinkDialog';

export const TeamLibrary = () => {
  const { teamLibrary, personas, addToTeam, removeFromTeam, addPersona, duplicatePersona, setActivePersona, getShareableLink, showToast, exportAll, importAll } = useStore();
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'date'>('date');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  const filteredTeam = useMemo(() => {
    let filtered = [...teamLibrary];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.role?.toLowerCase().includes(q)
      );
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'role') return (a.role || '').localeCompare(b.role || '');
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    return filtered;
  }, [teamLibrary, searchQuery, sortBy]);

  const availablePersonas = useMemo(() => {
    return personas.filter(p => !teamLibrary.some(tp => tp.id === p.id));
  }, [personas, teamLibrary]);

  const handleAddToTeam = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      addToTeam(persona);
      showToast('Added to team library!');
    }
  };

  const handleDuplicateToPersonal = (personaId: string) => {
    duplicatePersona(personaId);
    showToast('Copied to your personas!');
    navigate('/');
  };

  const handleRemoveFromTeam = (personaId: string) => {
    if (confirm('Remove this persona from team library?')) {
      removeFromTeam(personaId);
      showToast('Removed from team library!');
    }
  };

  const handleShare = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setShareDialogOpen(true);
  };

  const handleExportTeam = () => {
    const data = JSON.stringify(teamLibrary, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-personas-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${teamLibrary.length} personas!`);
  };

  const handleImport = () => {
    try {
      const result = importAll(importJson);
      if (result.success) {
        showToast('Personas imported successfully!');
        setImportModalOpen(false);
        setImportJson('');
      } else {
        showToast(result.error || 'Import failed', 'error');
      }
    } catch {
      showToast('Invalid JSON format', 'error');
    }
  };

  const handleBulkAdd = () => {
    availablePersonas.forEach(p => addToTeam(p));
    showToast(`Added ${availablePersonas.length} personas to team!`);
  };

  const stats = useMemo(() => ({
    total: teamLibrary.length,
    avgGoals: teamLibrary.length > 0 ? Math.round(teamLibrary.reduce((sum, p) => sum + (p.goals?.length || 0), 0) / teamLibrary.length) : 0,
    avgCompleteness: teamLibrary.length > 0 ? Math.round(teamLibrary.reduce((sum, p) => {
      let score = 0;
      if (p.name) score += 15;
      if (p.role) score += 15;
      if (p.avatar) score += 5;
      if (p.demographics?.age || p.demographics?.location) score += 10;
      if (p.background) score += 10;
      if (p.goals?.length) score += Math.min(p.goals.length * 5, 15);
      if (p.painPoints?.length) score += Math.min(p.painPoints.length * 5, 10);
      if (p.quote) score += 5;
      return sum + score;
    }, 0) / teamLibrary.length) : 0,
  }), [teamLibrary]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--text)]">Team Library</h1>
          <p className="text-[var(--text-secondary)] mt-1">Shared personas for your team</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setImportModalOpen(true)} className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button onClick={handleExportTeam} disabled={teamLibrary.length === 0} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {teamLibrary.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <Users className="w-5 h-5 text-[var(--accent)] mb-2" />
            <p className="text-2xl font-bold text-[var(--text)]">{stats.total}</p>
            <p className="text-xs text-[var(--text-secondary)]">Total Personas</p>
          </div>
          <div className="card p-4">
            <Target className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-[var(--text)]">{stats.avgGoals}</p>
            <p className="text-xs text-[var(--text-secondary)]">Avg Goals</p>
          </div>
          <div className="card p-4">
            <Activity className="w-5 h-5 text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-[var(--text)]">{stats.avgCompleteness}%</p>
            <p className="text-xs text-[var(--text-secondary)]">Avg Complete</p>
          </div>
          <div className="card p-4">
            <SlidersHorizontal className="w-5 h-5 text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-[var(--text)]">{personas.length}</p>
            <p className="text-xs text-[var(--text-secondary)]">Available</p>
          </div>
        </div>
      )}

      {teamLibrary.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search team personas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as 'name' | 'role' | 'date')}
            className="input-field"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
          </select>
          <div className="flex gap-1 border border-[var(--border)] rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : ''}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[var(--accent)] text-white' : ''}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {teamLibrary.length === 0 ? (
        <div className="card p-12 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-2">No team personas</h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
            Add personas to your team library to share them with your team members
          </p>
          {availablePersonas.length > 0 && (
            <button onClick={handleBulkAdd} className="btn-primary">
              Add All Available ({availablePersonas.length})
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeam.map((persona, index) => (
            <div key={persona.id} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#00C2FF] flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg shadow-[var(--accent)]/20">
                  {persona.avatar ? (
                    <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
                  ) : (
                    persona.name?.charAt(0) || '?'
                  )}
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
              <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                <button onClick={() => handleDuplicateToPersonal(persona.id)} className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1.5">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button onClick={() => handleShare(persona.id)} className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleRemoveFromTeam(persona.id)} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTeam.map(persona => (
            <div key={persona.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-bold">
                {persona.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--text)]">{persona.name || 'Unnamed'}</p>
                <p className="text-sm text-[var(--text-secondary)]">{persona.role || 'No role'}</p>
              </div>
              <div className="flex gap-2 items-center text-xs text-[var(--text-secondary)]">
                <span>{persona.goals?.length || 0} goals</span>
                <span>•</span>
                <span>{persona.painPoints?.length || 0} pain points</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDuplicateToPersonal(persona.id)} className="btn-secondary text-sm py-2">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => handleShare(persona.id)} className="px-3 py-2 bg-[var(--bg-secondary)] rounded-lg">
                  <Share2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleRemoveFromTeam(persona.id)} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {availablePersonas.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">Add to Team Library</h2>
            <button onClick={handleBulkAdd} className="btn-secondary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePersonas.map(persona => (
              <div key={persona.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                    {persona.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text)] truncate">{persona.name || 'Unnamed'}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{persona.role || 'No role'}</p>
                  </div>
                </div>
                <button onClick={() => handleAddToTeam(persona.id)} className="p-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ShareLinkDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        getLink={() => selectedPersonaId ? getShareableLink(selectedPersonaId) : ''}
        hasPassword={false}
      />

      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setImportModalOpen(false)} />
          <div className="relative bg-[var(--card-bg)] rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">Import Personas</h3>
              <button onClick={() => setImportModalOpen(false)} className="p-1 hover:bg-[var(--bg-secondary)] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={importJson}
              onChange={e => setImportJson(e.target.value)}
              placeholder='Paste JSON array here, e.g. [{"name": "John", "role": "PM"}]'
              className="input-field h-48 font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setImportModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleImport} className="flex-1 btn-primary">Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};