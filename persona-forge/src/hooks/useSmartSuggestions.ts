import type { Persona } from '../types';

interface Suggestion {
  field: string;
  suggestions: string[];
  type: 'goal' | 'painPoint' | 'motivation' | 'behavior' | 'channel' | 'value';
}

const roleSuggestions: Record<string, Suggestion[]> = {
  CTO: [
    { field: 'goals', suggestions: ['Drive digital transformation', 'Improve ROI from tech investments', 'Build scalable infrastructure', 'Attract top engineering talent'], type: 'goal' },
    { field: 'painPoints', suggestions: ['Legacy system debt', 'Vendor lock-in concerns', ' cybersecurity threats', 'Budget constraints'], type: 'painPoint' },
    { field: 'motivations', suggestions: ['Innovation leadership', 'Competitive advantage', 'Team excellence'], type: 'motivation' },
    { field: 'behaviors', suggestions: ['Researches emerging technologies', 'Evaluates multiple vendors', 'Prioritizes data-driven decisions'], type: 'behavior' },
    { field: 'preferredChannels', suggestions: ['Executive briefings', 'Slack', 'LinkedIn'], type: 'channel' },
    { field: 'brandValues', suggestions: ['Innovation', 'Scalability', 'Security'], type: 'value' },
  ],
  'Senior Designer': [
    { field: 'goals', suggestions: ['Create impactful designs', 'Grow design skills', 'Influence product direction', 'Build design system'], type: 'goal' },
    { field: 'painPoints', suggestions: ['Limited design resources', 'Stakeholder feedback conflicts', 'Tight deadlines', 'Inconsistent brand guidelines'], type: 'painPoint' },
    { field: 'motivations', suggestions: ['Creative expression', 'User impact', 'Professional growth'], type: 'motivation' },
    { field: 'behaviors', suggestions: ['Explores design trends', 'Conducts user research', 'Iterates quickly'], type: 'behavior' },
    { field: 'preferredChannels', suggestions: ['Figma', 'Slack', 'Video calls'], type: 'channel' },
    { field: 'brandValues', suggestions: ['Creativity', 'User-centricity', 'Innovation'], type: 'value' },
  ],
  'Senior Software Engineer': [
    { field: 'goals', suggestions: ['Write clean, maintainable code', 'Mentor junior developers', 'Improve system performance', 'Contribute to open source'], type: 'goal' },
    { field: 'painPoints', suggestions: ['Technical debt', 'Unclear requirements', 'Tight schedules', 'Code review delays'], type: 'painPoint' },
    { field: 'motivations', suggestions: ['Technical excellence', 'Learning new technologies', 'Solving complex problems'], type: 'motivation' },
    { field: 'behaviors', suggestions: ['Reads documentation thoroughly', 'Writes tests first', 'Prefers asynchronous communication'], type: 'behavior' },
    { field: 'preferredChannels', suggestions: ['GitHub', 'Slack', 'Email'], type: 'channel' },
    { field: 'brandValues', suggestions: ['Clean code', 'Open source', 'Documentation'], type: 'value' },
  ],
  'Marketing Manager': [
    { field: 'goals', suggestions: ['Increase brand awareness', 'Generate leads', 'Improve conversion rates', 'Build social presence'], type: 'goal' },
    { field: 'painPoints', suggestions: ['Limited budget', 'Attribution challenges', 'Content creation bottleneck', 'Changing algorithms'], type: 'painPoint' },
    { field: 'motivations', suggestions: ['Creative storytelling', 'Measurable impact', 'Industry recognition'], type: 'motivation' },
    { field: 'behaviors', suggestions: ['A/B tests campaigns', 'Monitors analytics daily', 'Engages with influencers'], type: 'behavior' },
    { field: 'preferredChannels', suggestions: ['Social media', 'Video calls', 'Slack'], type: 'channel' },
    { field: 'brandValues', suggestions: ['Creativity', 'Authenticity', 'Impact'], type: 'value' },
  ],
  'CEO & Founder': [
    { field: 'goals', suggestions: ['Scale the business', 'Raise next round', 'Build world-class team', 'Achieve product-market fit'], type: 'goal' },
    { field: 'painPoints', suggestions: ['Capital constraints', 'Talent acquisition', 'Market uncertainty', 'Investor expectations'], type: 'painPoint' },
    { field: 'motivations', suggestions: ['Building something meaningful', 'Disruption', 'Independence'], type: 'motivation' },
    { field: 'behaviors', suggestions: ['Wears multiple hats', 'Prioritizes speed', 'Focuses on fundamentals'], type: 'behavior' },
    { field: 'preferredChannels', suggestions: ['Twitter', 'LinkedIn', 'Video calls'], type: 'channel' },
    { field: 'brandValues', suggestions: ['Disruption', 'Speed', 'User focus'], type: 'value' },
  ],
};

const defaultSuggestions: Suggestion[] = [
  { field: 'goals', suggestions: ['Save time and money', 'Improve efficiency', 'Achieve better results', 'Reduce stress'], type: 'goal' },
  { field: 'painPoints', suggestions: ['Time constraints', 'Limited resources', 'Complex processes', 'Poor communication'], type: 'painPoint' },
  { field: 'motivations', suggestions: ['Work-life balance', 'Financial security', 'Personal growth', 'Recognition'], type: 'motivation' },
  { field: 'behaviors', suggestions: ['Researches online before purchasing', 'Asks for recommendations', 'Compares options', 'Values reviews'], type: 'behavior' },
  { field: 'preferredChannels', suggestions: ['Email', 'Phone', 'In-person', 'Social media'], type: 'channel' },
  { field: 'brandValues', suggestions: ['Quality', 'Trust', 'Innovation', 'Customer service'], type: 'value' },
];

export const useSmartSuggestions = (persona: Partial<Persona>) => {
  const getSuggestions = (field: string): string[] => {
    const role = persona.role?.toLowerCase() || '';
    
    for (const [roleKey, suggestions] of Object.entries(roleSuggestions)) {
      if (role.includes(roleKey.toLowerCase().replace(' ', ''))) {
        const match = suggestions.find((s) => s.field === field);
        if (match) return match.suggestions;
      }
    }
    
    const defaultMatch = defaultSuggestions.find((s) => s.field === field);
    return defaultMatch?.suggestions || [];
  };

  const getFilteredSuggestions = (field: string, existing: string[] = []): string[] => {
    const suggestions = getSuggestions(field);
    return suggestions.filter((s) => !existing.includes(s));
  };

  return { getSuggestions, getFilteredSuggestions };
};

export const getCompletenessScore = (persona: Partial<Persona>): { score: number; missing: string[] } => {
  const fields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'role', label: 'Role', required: true },
    { key: 'avatar', label: 'Avatar', required: false },
    { key: 'demographics.age', label: 'Age', required: false },
    { key: 'demographics.location', label: 'Location', required: false },
    { key: 'demographics.income', label: 'Income', required: false },
    { key: 'demographics.education', label: 'Education', required: false },
    { key: 'background', label: 'Background', required: false },
    { key: 'goals', label: 'Goals', required: true },
    { key: 'painPoints', label: 'Pain Points', required: true },
    { key: 'motivations', label: 'Motivations', required: false },
    { key: 'behaviors', label: 'Behaviors', required: false },
    { key: 'quote', label: 'Quote', required: false },
    { key: 'communicationStyle', label: 'Communication Style', required: false },
    { key: 'preferredChannels', label: 'Preferred Channels', required: false },
    { key: 'brandValues', label: 'Brand Values', required: false },
    { key: 'preferredTone', label: 'Preferred Tone', required: false },
  ];

  let filled = 0;
  const missing: string[] = [];

  for (const field of fields) {
    const keys = field.key.split('.');
    let value: unknown = persona;
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
    }
    
    if (value) {
      if (Array.isArray(value) && value.length > 0) {
        filled += field.required ? 2 : 1;
      } else if (typeof value === 'string' && value.trim()) {
        filled += field.required ? 2 : 1;
      } else if (!field.required) {
        filled += 0.5;
      }
    } else if (field.required) {
      missing.push(field.label);
    }
  }

  const maxScore = fields.reduce((sum, f) => sum + (f.required ? 2 : 1), 0);
  const score = Math.round((filled / maxScore) * 100);

  return { score: Math.max(0, score), missing };
};