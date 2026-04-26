import { useState, useEffect } from 'react';
import { useStore, getDefaultPersona } from '../store/useStore';
import { PersonaForm } from '../components/PersonaForm';
import { PersonaPreview } from '../components/PersonaPreview';
import { useExport } from '../hooks/useExport';
import { getCompletenessScore } from '../hooks/useSmartSuggestions';
import { CompletenessIndicator, SuggestionChip } from '../components/CompletenessIndicator';
import { ExportValidation } from '../components/ExportValidation';
import { VersionHistory } from '../components/VersionHistory';
import type { Persona, PersonaVersion } from '../types';
import { Plus, FileJson, FileCode, Sparkles, Clock, Save } from 'lucide-react';

const goalSuggestions = ['Save time and money', 'Improve efficiency', 'Achieve better results', 'Reduce stress'];
const painPointSuggestions = ['Time constraints', 'Limited resources', 'Complex processes', 'Poor communication'];

export const PersonaBuilder = () => {
  const { personas, activePersonaId, addPersona, updatePersona, setActivePersona, showToast, revertToVersion } = useStore();
  const { exportJSON, exportHTML, previewRef } = useExport();
  const [isNew, setIsNew] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [localData, setLocalData] = useState<Partial<Persona>>({});
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    if (activePersonaId) {
      const found = personas.find(p => p.id === activePersonaId);
      if (found && !isNew) {
        setLocalData(found);
      }
    } else if (!activePersonaId && !isNew) {
      setLocalData({});
    }
  }, [activePersonaId, personas, isNew]);

  const activePersona = personas.find(p => p.id === activePersonaId);
  const completeness = getCompletenessScore(localData);

  const handleChange = (updates: Partial<Persona>) => {
    setLocalData(prev => ({ ...prev, ...updates }));
    setUnsaved(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (isNew) {
      const newPersona: Persona = {
        ...localData as Persona,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      addPersona(newPersona);
      setActivePersona(newPersona.id);
      setLocalData({});
      setIsNew(false);
      showToast('Persona created!');
    } else if (activePersonaId) {
      updatePersona(activePersonaId, localData);
      showToast('Persona saved!');
    }
    setUnsaved(false);
  };

  const handleNew = () => {
    setIsNew(true);
    setActivePersona(null);
    setLocalData({});
  };

  const handleDuplicateAsVariant = () => {
    if (activePersonaId && variantName) {
      const { personas } = useStore.getState();
      const original = personas.find(p => p.id === activePersonaId);
      if (original) {
        useStore.getState().addPersona({ ...original, id: crypto.randomUUID(), name: variantName });
        showToast('Variant created!');
      }
      setVariantName('');
      setShowVariantModal(false);
    }
  };

  const handleAddSuggestion = (field: keyof Persona, value: string) => {
    const current = (localData[field] as string[]) || [];
    if (!current.includes(value)) {
      const updates = { [field]: [...current, value] };
      setLocalData(prev => ({ ...prev, ...updates }));
      setUnsaved(true);
    }
  };

  return (
    <div className="h-full flex flex-col pb-20">
      {showVariantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowVariantModal(false)} />
          <div className="relative bg-[var(--bg)] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Duplicate as Variant</h3>
            <input
              type="text"
              value={variantName}
              onChange={e => setVariantName(e.target.value)}
              placeholder="Variant name"
              className="input w-full mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowVariantModal(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleDuplicateAsVariant} className="flex-1 btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}

      {showVersionHistory && activePersona && (
        <VersionHistory
          persona={activePersona}
          onRevert={(version) => {
            if (activePersonaId) {
              revertToVersion(activePersonaId, version.version);
              setLocalData(version.data as Partial<Persona>);
              setShowVersionHistory(false);
              showToast('Reverted to version ' + version.version);
            }
          }}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {isNew ? 'Create New Persona' : activePersona ? `Editing: ${activePersona.name}` : 'Persona Builder'}
          </h1>
          {unsaved && <p className="text-sm text-yellow-500 mt-1">Unsaved changes</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleNew} className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" />New
          </button>
          <button onClick={() => setShowVariantModal(true)} className="btn-secondary flex items-center gap-2" disabled={!activePersonaId}>
            <Sparkles className="w-4 h-4" />Variant
          </button>
          <button onClick={() => setShowVersionHistory(true)} className="btn-secondary flex items-center gap-2" disabled={!activePersonaId}>
            <Clock className="w-4 h-4" />History
          </button>
          <button onClick={() => { exportJSON(localData as Persona); showToast('Exported JSON!'); }} className="btn-secondary flex items-center gap-2">
            <FileJson className="w-4 h-4" />JSON
          </button>
          <button onClick={() => { exportHTML(localData as Persona); showToast('Exported HTML!'); }} className="btn-primary flex items-center gap-2">
            <FileCode className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 overflow-y-auto">
          <PersonaForm persona={localData} onChange={handleChange} />
        </div>
        <div className="space-y-4">
          <ExportValidation persona={localData} />
          <CompletenessIndicator score={completeness.score} missing={completeness.missing} />

          {goalSuggestions.length > 0 && (
            <div className="card p-4 space-y-2">
              <p className="text-xs font-medium text-[var(--text-secondary)]">Suggested Goals</p>
              <div className="flex flex-wrap gap-1.5">
                {goalSuggestions.slice(0, 3).map(s => (
                  <SuggestionChip key={s} suggestion={s} onClick={() => handleAddSuggestion('goals', s)} />
                ))}
              </div>
            </div>
          )}

          {painPointSuggestions.length > 0 && (
            <div className="card p-4 space-y-2">
              <p className="text-xs font-medium text-[var(--text-secondary)]">Suggested Pain Points</p>
              <div className="flex flex-wrap gap-1.5">
                {painPointSuggestions.slice(0, 3).map(s => (
                  <SuggestionChip key={s} suggestion={s} onClick={() => handleAddSuggestion('painPoints', s)} />
                ))}
              </div>
            </div>
          )}

          <div ref={previewRef}>
            <PersonaPreview persona={localData as Persona} />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="fixed bottom-6 right-6 z-50 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
        {isNew ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
        {isNew ? 'Create' : 'Save'}
      </button>
    </div>
  );
};