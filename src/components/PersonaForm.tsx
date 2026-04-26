import { useState, useEffect } from 'react';
import type { Persona } from '../types';
import { Plus, X, Sparkles, Wand2, TrendingUp, Lightbulb } from 'lucide-react';

export const PersonaForm = ({ persona, onChange }: { persona: Partial<Persona>; onChange: (u: Partial<Persona>) => void }) => {
  const [form, setForm] = useState<any>(persona);
  const [newGoal, setNewGoal] = useState('');
  const [newPain, setNewPain] = useState('');
  const [newMotivation, setNewMotivation] = useState('');
  const [newBehavior, setNewBehavior] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newBrandValue, setNewBrandValue] = useState('');
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    setForm(persona);
  }, [persona]);

  const update = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    onChange({ [field]: value });
  };

  const addItem = (field: string, value: string, clear: () => void) => {
    if (!value.trim()) return;
    const items = form[field] || [];
    const updated = [...items, value.trim()];
    setForm((prev: any) => ({ ...prev, [field]: updated }));
    onChange({ [field]: updated });
    clear();
  };

  const removeItem = (field: string, index: number) => {
    const items = form[field] || [];
    const updated = items.filter((_: any, i: number) => i !== index);
    setForm((prev: any) => ({ ...prev, [field]: updated }));
    onChange({ [field]: updated });
  };

  const handleAIGenerate = () => {
    const names = ['Alex Morgan', 'Jordan Lee', 'Casey Rivera', 'Taylor Smith'];
    const roles = ['Product Manager', 'Designer', 'Developer', 'Marketing'];
    const data = {
      name: names[Math.floor(Math.random() * names.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces',
      demographics: { age: String(25 + Math.floor(Math.random() * 20)), location: 'San Francisco, CA', income: '$100,000', education: 'MBA' },
      background: 'Experienced professional with a track record of success.',
      goals: ['Ship faster', 'Build team', 'Drive impact'],
      painPoints: ['Too many meetings', 'Resource constraints'],
      motivations: ['User impact', 'Career growth'],
      behaviors: ['Checks analytics daily', 'Attends conferences'],
      quote: 'The best products are built by teams that understand users deeply.',
      personalityTraits: { openness: 70, conscientiousness: 80, extraversion: 60, agreeableness: 70, neuroticism: 30 },
      communicationStyle: 'Direct and collaborative',
      preferredChannels: ['Slack', 'Email'],
      techSavvy: 80,
    };
    setForm(data);
    onChange(data);
  };

  const handleVariation = () => {
    const variations = [
      { background: 'Ambitious professional focused on rapid career advancement.', goals: ['Accelerate career growth', 'Take on more responsibility'], painPoints: ['Imposter syndrome', 'Lack of mentorship'] },
      { background: 'Senior professional with deep expertise in enterprise environments.', goals: ['Drive organizational change', 'Build partnerships'], painPoints: ['Bureaucracy', 'Alignment across teams'] },
    ];
    const random = variations[Math.floor(Math.random() * variations.length)];
    setForm((prev: any) => ({ ...prev, ...random }));
    onChange(random);
  };

  const handleEnhance = () => {
    const enhancements: any = {};
    let added = 0;
    
    if (!form.quote && form.name) {
      enhancements.quote = `"${form.name} believes that innovation distinguishes between a leader and a follower."`;
      added++;
    }
    if (!form.preferredChannels || form.preferredChannels.length === 0) {
      enhancements.preferredChannels = ['Slack', 'Email', 'Video calls'];
      added++;
    }
    if (!form.brandValues || form.brandValues.length === 0) {
      enhancements.brandValues = ['Quality', 'Innovation', 'User focus'];
      added++;
    }
    if (!form.communicationStyle) {
      enhancements.communicationStyle = 'Direct, collaborative, and data-driven';
      added++;
    }
    
    if (added > 0) {
      setForm((prev: any) => ({ ...prev, ...enhancements }));
      onChange(enhancements);
      setShowAI(true);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="font-display text-xl font-semibold text-[var(--text)]">Persona Details</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleAIGenerate} className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />AI Generate
          </button>
          <button onClick={() => setShowAI(!showAI)} className="btn-secondary flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />{showAI ? 'Hide' : 'Suggestions'}
          </button>
          <button onClick={handleVariation} className="btn-secondary flex items-center gap-2">
            <Wand2 className="w-4 h-4" />Variation
          </button>
          <button onClick={handleEnhance} className="btn-secondary flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />Enhance
          </button>
        </div>
      </div>

      {showAI && (
        <div className="card p-4 bg-gradient-to-r from-[var(--accent)]/5 to-transparent">
          <p className="text-sm text-[var(--text-secondary)]">💡 AI Suggestions are available. Use AI Generate to auto-fill fields or Variation to create alternative versions.</p>
        </div>
      )}

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Name</label>
            <input type="text" value={form.name || ''} onChange={e => update('name', e.target.value)} className="input-field" placeholder="Sarah Chen" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Role/Title</label>
            <input type="text" value={form.role || ''} onChange={e => update('role', e.target.value)} className="input-field" placeholder="Marketing Director" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Avatar URL</label>
          <input type="text" value={form.avatar || ''} onChange={e => update('avatar', e.target.value)} className="input-field" placeholder="https://..." />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Demographics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Age</label>
            <input type="text" value={form.demographics?.age || ''} onChange={e => update('demographics', { ...(form.demographics || {}), age: e.target.value })} className="input-field" placeholder="28" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
            <input type="text" value={form.demographics?.location || ''} onChange={e => update('demographics', { ...(form.demographics || {}), location: e.target.value })} className="input-field" placeholder="San Francisco" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Income</label>
            <input type="text" value={form.demographics?.income || ''} onChange={e => update('demographics', { ...(form.demographics || {}), income: e.target.value })} className="input-field" placeholder="$100k" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Education</label>
            <input type="text" value={form.demographics?.education || ''} onChange={e => update('demographics', { ...(form.demographics || {}), education: e.target.value })} className="input-field" placeholder="MBA" />
          </div>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Background</h3>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Background Story</label>
          <textarea value={form.background || ''} onChange={e => update('background', e.target.value)} className="input-field h-24 resize-none" placeholder="Tell their story..." />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Goals</h3>
        <div className="flex gap-2">
          <input type="text" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Add a goal..." className="input-field flex-1" />
          <button onClick={() => addItem('goals', newGoal, () => setNewGoal(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.goals || []).map((g: string, i: number) => <span key={i} className="chip chip-green">{g}<button onClick={() => removeItem('goals', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Pain Points</h3>
        <div className="flex gap-2">
          <input type="text" value={newPain} onChange={e => setNewPain(e.target.value)} placeholder="Add a pain point..." className="input-field flex-1" />
          <button onClick={() => addItem('painPoints', newPain, () => setNewPain(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.painPoints || []).map((p: string, i: number) => <span key={i} className="chip chip-red">{p}<button onClick={() => removeItem('painPoints', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Motivations</h3>
        <div className="flex gap-2">
          <input type="text" value={newMotivation} onChange={e => setNewMotivation(e.target.value)} placeholder="Add a motivation..." className="input-field flex-1" />
          <button onClick={() => addItem('motivations', newMotivation, () => setNewMotivation(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.motivations || []).map((m: string, i: number) => <span key={i} className="chip chip-blue">{m}<button onClick={() => removeItem('motivations', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Behaviors</h3>
        <div className="flex gap-2">
          <input type="text" value={newBehavior} onChange={e => setNewBehavior(e.target.value)} placeholder="Add a behavior..." className="input-field flex-1" />
          <button onClick={() => addItem('behaviors', newBehavior, () => setNewBehavior(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.behaviors || []).map((m: string, i: number) => <span key={i} className="chip chip-purple">{m}<button onClick={() => removeItem('behaviors', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Personality Traits</h3>
        <div className="space-y-3">
          {['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].map((trait: string) => (
            <div key={trait}>
              <label className="flex justify-between text-sm text-[var(--text-secondary)] mb-1 capitalize">{trait.replace('_', ' ')}: {form.personalityTraits?.[trait] || 50}</label>
              <input type="range" min="0" max="100" value={form.personalityTraits?.[trait] || 50} onChange={e => update('personalityTraits', { ...(form.personalityTraits || {}), [trait]: parseInt(e.target.value) })} className="w-full accent-[var(--accent)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Communication</h3>
        <input type="text" value={form.communicationStyle || ''} onChange={e => update('communicationStyle', e.target.value)} className="input-field" placeholder="Communication style..." />
        <textarea value={form.quote || ''} onChange={e => update('quote', e.target.value)} className="input-field h-20" placeholder="A memorable quote..." />
        <input type="text" value={form.preferredTone || ''} onChange={e => update('preferredTone', e.target.value)} className="input-field" placeholder="Preferred tone..." />
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Tech Profile</h3>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Tech Savvy: {form.techSavvy || 50}%</label>
        <input type="range" min="0" max="100" value={form.techSavvy || 50} onChange={e => update('techSavvy', parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Tags</h3>
        <div className="flex gap-2">
          <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add a tag..." className="input-field flex-1" />
          <button onClick={() => addItem('tags', newTag, () => setNewTag(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.tags || []).map((t: string, i: number) => <span key={i} className="chip">{t}<button onClick={() => removeItem('tags', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Brand Values</h3>
        <div className="flex gap-2">
          <input type="text" value={newBrandValue} onChange={e => setNewBrandValue(e.target.value)} placeholder="Add a value..." className="input-field flex-1" />
          <button onClick={() => addItem('brandValues', newBrandValue, () => setNewBrandValue(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.brandValues || []).map((t: string, i: number) => <span key={i} className="chip chip-blue">{t}<button onClick={() => removeItem('brandValues', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Preferred Channels</h3>
        <div className="flex gap-2">
          <input type="text" value={newChannel} onChange={e => setNewChannel(e.target.value)} placeholder="Add a channel..." className="input-field flex-1" />
          <button onClick={() => addItem('preferredChannels', newChannel, () => setNewChannel(''))} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.preferredChannels || []).map((t: string, i: number) => <span key={i} className="chip chip-purple">{t}<button onClick={() => removeItem('preferredChannels', i)} className="ml-1"><X className="w-3 h-3" /></button></span>)}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-display text-lg font-medium text-[var(--text)]">Notes</h3>
        <textarea value={form.notes || ''} onChange={e => update('notes', e.target.value)} className="input-field h-24 resize-none" placeholder="Additional notes..." />
      </div>
    </div>
  );
};