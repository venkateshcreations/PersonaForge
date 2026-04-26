import { useState } from 'react';
import type { Persona } from '../types';

interface AISuggestion {
  type: 'goal' | 'painPoint' | 'motivation' | 'behavior' | 'channel' | 'value';
  text: string;
  confidence: number;
}

interface AIFeedback {
  category: 'strength' | 'suggestion' | 'improvement';
  text: string;
}

const roleSuggestions: Record<string, Record<string, AISuggestion[]>> = {
  'Product Manager': {
    goals: [
      { type: 'goal', text: 'Ship products faster without sacrificing quality', confidence: 95 },
      { type: 'goal', text: 'Build a high-performing team', confidence: 90 },
      { type: 'goal', text: 'Drive measurable business impact', confidence: 88 },
    ],
    painPoints: [
      { type: 'painPoint', text: 'Too many meetings, not enough focus time', confidence: 92 },
      { type: 'painPoint', text: 'Difficulty aligning stakeholders on priorities', confidence: 85 },
      { type: 'painPoint', text: 'Lack of clear success metrics', confidence: 80 },
    ],
    motivations: [
      { type: 'motivation', text: 'Making a real impact on users', confidence: 90 },
      { type: 'motivation', text: 'Career advancement and recognition', confidence: 85 },
      { type: 'motivation', text: 'Building great products with talented people', confidence: 88 },
    ],
    behaviors: [
      { type: 'behavior', text: 'Checks analytics dashboards daily', confidence: 75 },
      { type: 'behavior', text: 'Attends industry conferences monthly', confidence: 70 },
      { type: 'behavior', text: 'Prefers async communication', confidence: 72 },
    ],
  },
  CEO: {
    goals: [
      { type: 'goal', text: 'Scale company revenue to $100M ARR', confidence: 95 },
      { type: 'goal', text: 'Build world-class executive team', confidence: 90 },
      { type: 'goal', text: 'Establish market leadership', confidence: 88 },
    ],
    painPoints: [
      { type: 'painPoint', text: 'Managing board and investor relations', confidence: 85 },
      { type: 'painPoint', text: 'Balancing short-term vs long-term goals', confidence: 80 },
      { type: 'painPoint', text: 'Talent acquisition at scale', confidence: 78 },
    ],
    motivations: [
      { type: 'motivation', text: 'Building something transformative', confidence: 92 },
      { type: 'motivation', text: 'Creating jobs and economic value', confidence: 88 },
      { type: 'motivation', text: 'Industry disruption', confidence: 85 },
    ],
    behaviors: [
      { type: 'behavior', text: 'Reads P&L reports weekly', confidence: 80 },
      { type: 'behavior', text: 'Network with other founders', confidence: 75 },
      { type: 'behavior', text: 'Delegates operational details', confidence: 78 },
    ],
  },
  Designer: {
    goals: [
      { type: 'goal', text: 'Create intuitive user experiences', confidence: 95 },
      { type: 'goal', text: 'Build a strong design system', confidence: 88 },
      { type: 'goal', text: 'Influence product strategy', confidence: 82 },
    ],
    painPoints: [
      { type: 'painPoint', text: 'Getting stakeholders to understand design', confidence: 90 },
      { type: 'painPoint', text: 'Tight deadlines with high quality expectations', confidence: 85 },
      { type: 'painPoint', text: 'Balancing aesthetics with functionality', confidence: 80 },
    ],
    motivations: [
      { type: 'motivation', text: 'Solving complex problems creatively', confidence: 92 },
      { type: 'motivation', text: 'Recognition for great work', confidence: 85 },
      { type: 'motivation', text: 'Continuous learning and growth', confidence: 88 },
    ],
    behaviors: [
      { type: 'behavior', text: 'Browses Dribbble and Behance for inspiration', confidence: 85 },
      { type: 'behavior', text: 'Uses Figma daily', confidence: 95 },
      { type: 'behavior', text: 'Conducts user research sessions', confidence: 78 },
    ],
  },
  Developer: {
    goals: [
      { type: 'goal', text: 'Write clean, maintainable code', confidence: 95 },
      { type: 'goal', text: 'Ship features on time', confidence: 90 },
      { type: 'goal', text: 'Improve system performance', confidence: 85 },
    ],
    painPoints: [
      { type: 'painPoint', text: 'Unclear or changing requirements', confidence: 92 },
      { type: 'painPoint', text: 'Legacy code debt', confidence: 88 },
      { type: 'painPoint', text: 'Meeting deadlines with quality', confidence: 82 },
    ],
    motivations: [
      { type: 'motivation', text: 'Solving interesting technical challenges', confidence: 95 },
      { type: 'motivation', text: 'Working with modern technologies', confidence: 88 },
      { type: 'motivation', text: 'Open source contribution', confidence: 80 },
    ],
    behaviors: [
      { type: 'behavior', text: 'Prefers asynchronous communication', confidence: 85 },
      { type: 'behavior', text: 'Reviews pull requests daily', confidence: 80 },
      { type: 'behavior', text: 'Reads technical documentation', confidence: 78 },
    ],
  },
  Marketing: {
    goals: [
      { type: 'goal', text: 'Increase brand awareness', confidence: 92 },
      { type: 'goal', text: 'Drive qualified leads', confidence: 90 },
      { type: 'goal', text: 'Build engaged community', confidence: 85 },
    ],
    painPoints: [
      { type: 'painPoint', text: 'Proving ROI on campaigns', confidence: 88 },
      { type: 'painPoint', text: 'Content creation at scale', confidence: 82 },
      { type: 'painPoint', text: 'Keeping up with trends', confidence: 78 },
    ],
    motivations: [
      { type: 'motivation', text: 'Creative expression', confidence: 90 },
      { type: 'motivation', text: 'Making an impact', confidence: 85 },
      { type: 'motivation', text: 'Building personal brand', confidence: 80 },
    ],
    behaviors: [
      { type: 'behavior', text: 'Monitors social media trends', confidence: 85 },
      { type: 'behavior', text: 'A/B tests campaigns', confidence: 82 },
      { type: 'behavior', text: 'AttendsMarketing conferences', confidence: 75 },
    ],
  },
};

const industries = ['SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'EdTech', 'Gaming', 'Enterprise', 'Startup'];

const backgrounds: Record<string, Record<string, string>> = {
  'Product Manager': {
    'SaaS': 'Experienced Product Manager with 7+ years in B2B SaaS, leading cross-functional teams to ship enterprise solutions used by Fortune 500 companies.',
    'Fintech': 'Product Manager with deep fintech expertise, managing complex financial products while navigating regulatory compliance.',
    'Healthcare': 'Healthcare PM focused on patient-centric solutions, HIPAA compliance, and integrating with EHR systems.',
    'E-commerce': 'E-commerce specialist with experience in inventory, checkout optimization, and marketplace dynamics.',
  },
  'CEO': {
    'SaaS': 'Serial entrepreneur who built and scaled 2 SaaS companies from seed to Series C funding.',
    'Fintech': 'Former investment banker turned fintech founder, focused on democratizing financial access.',
    'Healthcare': 'Healthcare entrepreneur with a mission to improve patient outcomes through technology.',
    'Startup': 'First-time founder who bootstrapped a startup to $10M ARR before raising seed funding.',
  },
  'Designer': {
    'SaaS': 'UX designer specializing in complex enterprise dashboards and data visualization interfaces.',
    'Fintech': 'Design leader who created accessible financial tools for diverse user bases.',
    'Mobile': 'Mobile-first designer with expertise in iOS and Material Design guidelines.',
    'Enterprise': 'Enterprise design systems architect with experience scaling design across large organizations.',
  },
  'Developer': {
    'SaaS': 'Full-stack developer with expertise in React, Node.js, and cloud architecture.',
    'Fintech': 'Backend engineer specializing in secure, scalable financial systems and real-time data processing.',
    'Enterprise': 'Systems architect with experience in legacy modernization and microservices migration.',
    'Startup': 'Full-stack developer comfortable with all aspects of building a product from scratch.',
  },
  'Marketing': {
    'SaaS': 'Growth marketer with proven track record in product-led growth and viral loops.',
    'Fintech': 'B2B marketing leader experienced in complex sales cycles and account-based marketing.',
    'E-commerce': 'D2C marketing specialist with expertise in performance marketing and retention.',
    'Startup': 'All-around marketer who has built marketing functions from the ground up at multiple startups.',
  },
};

const generateQuote = (name: string, role: string): string => {
  const quotes: Record<string, string> = {
    'Product Manager': `"The best products are built by teams that understand their users deeply."`,
    'CEO': `"Every unicorn started as a bug that someone refused to fix."`,
    'Designer': `"Great design is invisible. You don't notice it until it's wrong."`,
    'Developer': `"Code is like humor. When you have to explain it, it's bad."`,
    'Marketing': `"Marketing is telling people what they want to hear. Branding is being what they need to believe."`,
    'Sales': `"The best salespeople don't sell. They help."`,
  };
  const baseRole = Object.keys(quotes).find(r => role.toLowerCase().includes(r.toLowerCase()));
  return quotes[baseRole || 'Product Manager'] || `"Innovation distinguishes between a leader and a follower."`;
};

const variationTypes = [
  { id: 'junior', label: 'Junior', description: '2-3 years experience, learning focused' },
  { id: 'standard', label: 'Standard', description: '5-7 years, solid foundation' },
  { id: 'senior', label: 'Senior', description: '8-12 years, strategic thinker' },
  { id: 'lead', label: 'Lead/Principal', description: '12+ years, executive influence' },
  { id: 'remote', label: 'Remote', description: 'Distributed team member' },
  { id: 'contractor', label: 'Contractor', description: 'Short-term, deliverable focused' },
  { id: 'founder', label: 'Founder', description: 'Technical co-founder' },
  { id: 'executive', label: 'Executive', description: 'C-level, board level' },
];

const generateVariation = (role: string, variation: string, industry: string): Partial<Persona> => {
  const variations: Record<string, () => Partial<Persona>> = {
    junior: () => ({
      background: `Junior ${role} with 2-3 years of experience, eager to learn and grow.`,
      goals: ['Learn new skills', 'Build experience', 'Make meaningful contribution'],
      painPoints: ['Limited experience', 'Need mentorship', 'Learning curve'],
      motivations: ['Growth', 'Recognition', 'Skill development'],
      behaviors: ['Takes notes', 'Asks questions', 'Seeks feedback'],
      personalityTraits: { openness: 80, conscientiousness: 70, extraversion: 65, agreeableness: 75, neuroticism: 40 },
      communicationStyle: 'Open and communicative',
      techSavvy: 60,
    }),
    standard: () => ({
      background: `Experienced ${role} with 5-7 years track record of success.`,
      goals: ['Advance in career', 'Make meaningful impact', 'Build expertise'],
      painPoints: ['Limited resources', 'Work-life balance', 'Career growth'],
      motivations: ['Recognition', 'Growth', 'Impact'],
      behaviors: ['Continuous learner', 'Networker', 'Documentation focused'],
      personalityTraits: { openness: 70, conscientiousness: 75, extraversion: 60, agreeableness: 70, neuroticism: 35 },
      communicationStyle: 'Clear and collaborative',
      techSavvy: 75,
    }),
    senior: () => ({
      background: `Senior ${role} with 8-12 years of deep expertise. Strategic thinker with proven results.`,
      goals: ['Drive strategic initiatives', 'Mentor team members', 'Influence product roadmap'],
      painPoints: ['Strategic alignment', 'Resource allocation', 'Technical debt'],
      motivations: ['Company impact', 'Leadership', 'Industry thought leadership'],
      behaviors: ['Executive presence', 'Strategic planning', 'Cross-functional leadership'],
      personalityTraits: { openness: 65, conscientiousness: 85, extraversion: 55, agreeableness: 75, neuroticism: 25 },
      communicationStyle: 'Strategic and concise',
      techSavvy: 85,
    }),
    lead: () => ({
      background: `Principal ${role} with 12+ years. Known industry expert who shapes company direction.`,
      goals: ['Define company strategy', 'Build world-class team', 'Drive market leadership'],
      painPoints: ['Talent scarcity', 'Market disruption', 'Competitive pressure'],
      motivations: ['Legacy building', 'Industry impact', 'Team development'],
      behaviors: ['Board presentations', 'Executive hiring', 'Strategic partnerships'],
      personalityTraits: { openness: 75, conscientiousness: 90, extraversion: 70, agreeableness: 80, neuroticism: 20 },
      communicationStyle: 'Executive communication',
      techSavvy: 90,
    }),
    remote: () => ({
      background: `Remote ${role} with experience in distributed teams across multiple time zones.`,
      goals: ['Stay connected', 'Deliver independently', 'Asynchronous collaboration'],
      painPoints: ['Time zone challenges', 'Communication gaps', 'Isolation'],
      motivations: ['Flexibility', 'Work-life balance', 'Global perspective'],
      behaviors: ['Async communication', 'Self-management', 'Over-communication'],
      personalityTraits: { openness: 75, conscientiousness: 80, extraversion: 50, agreeableness: 70, neuroticism: 30 },
      communicationStyle: 'Over-communicative and async-friendly',
      techSavvy: 80,
    }),
    contractor: () => ({
      background: `Contracting ${role} focused on specific deliverables and timelines.`,
      goals: ['Deliver on time', 'Clear scope', 'Smooth handoff'],
      painPoints: ['Scope creep', 'Limited context', 'Quick integration needs'],
      motivations: ['Efficiency', 'Clear deliverables', 'Multiple projects'],
      behaviors: ['Time-boxed work', 'Deliverable focused', 'Documentation'],
      personalityTraits: { openness: 60, conscientiousness: 90, extraversion: 55, agreeableness: 65, neuroticism: 35 },
      communicationStyle: 'Direct and deliverable-focused',
      techSavvy: 85,
    }),
    founder: () => ({
      background: `Technical co-founder with hands-on experience building products from day one.`,
      goals: ['Product-market fit', 'Team building', 'Capital efficient growth'],
      painPoints: ['Resource constraints', 'Multiple hats', 'Investor relations'],
      motivations: ['Ownership', 'Vision creation', 'Disruption'],
      behaviors: ['Wears multiple hats', 'Rapid iteration', 'Hands-on building'],
      personalityTraits: { openness: 85, conscientiousness: 80, extraversion: 70, agreeableness: 65, neuroticism: 45 },
      communicationStyle: 'Direct and vision-driven',
      techSavvy: 95,
    }),
    executive: () => ({
      background: `C-suite ${role} with board-level experience and P&L ownership.`,
      goals: ['Board management', 'Investor relations', 'Company transformation'],
      painPoints: ['Board pressure', 'Investor expectations', 'Market timing'],
      motivations: ['Legacy', 'Industry impact', 'Team excellence'],
      behaviors: ['High-level strategy', 'Executive presence', 'Stakeholder management'],
      personalityTraits: { openness: 70, conscientiousness: 85, extraversion: 75, agreeableness: 80, neuroticism: 20 },
      communicationStyle: 'Executive and strategic',
      techSavvy: 75,
    }),
  };

  const ind = industry || 'SaaS';
  const roleData = backgrounds[role] || backgrounds['Product Manager'];
  const background = roleData[ind] || roleData['SaaS'];

  return {
    background,
    ...variations[variation](),
  };
};

export const useAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [feedback, setFeedback] = useState<AIFeedback[]>([]);

  const getSuggestions = (role: string, existingData: Partial<Persona>) => {
    setIsGenerating(true);
    setSuggestions([]);

    setTimeout(() => {
      const baseRole = Object.keys(roleSuggestions).find(r => 
        role.toLowerCase().includes(r.toLowerCase())
      ) || 'Product Manager';

      const roleData = roleSuggestions[baseRole] || roleSuggestions['Product Manager'];
      const newSuggestions: AISuggestion[] = [];

      if (existingData.goals?.length || 0 < 3) {
        newSuggestions.push(...roleData.goals.slice(0, 2));
      }
      if (existingData.painPoints?.length || 0 < 3) {
        newSuggestions.push(...roleData.painPoints.slice(0, 2));
      }
      if (existingData.motivations?.length || 0 < 2) {
        newSuggestions.push(...roleData.motivations.slice(0, 1));
      }
      if (existingData.behaviors?.length || 0 < 2) {
        newSuggestions.push(...roleData.behaviors.slice(0, 1));
      }

      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 800);
  };

  const generatePersona = async (role: string, variation: string = 'standard', industry: string = 'SaaS'): Promise<Partial<Persona>> => {
    setIsGenerating(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const persona = generateVariation(role, variation, industry);
        setIsGenerating(false);
        resolve(persona);
      }, 1200);
    });
  };

  const generateAllVariations = (role: string, industry: string = 'SaaS'): Promise<Partial<Persona>[]> => {
    setIsGenerating(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const allVars = variationTypes.map(v => ({
          ...generateVariation(role, v.id, industry),
          name: `${v.label} ${role}`,
        }));
        setIsGenerating(false);
        resolve(allVars);
      }, 2000);
    });
  };

  const analyzePersona = (persona: Partial<Persona>): AIFeedback[] => {
    setIsGenerating(true);
    const newFeedback: AIFeedback[] = [];

    setTimeout(() => {
      if (persona.goals?.length || 0 >= 3) {
        newFeedback.push({ category: 'strength', text: `Great job defining ${persona.goals?.length} clear goals!` });
      } else {
        newFeedback.push({ category: 'suggestion', text: 'Consider adding more goals (3-5 recommended) for a complete picture.' });
      }

      if (persona.painPoints?.length || 0 >= 2) {
        newFeedback.push({ category: 'strength', text: 'You have well-defined pain points to address.' });
      } else {
        newFeedback.push({ category: 'suggestion', text: 'Adding pain points helps teams empathize with user challenges.' });
      }

      if (!persona.quote) {
        newFeedback.push({ category: 'improvement', text: 'Adding a memorable quote makes the persona more relatable.' });
      }

      if (persona.personalityTraits) {
        const avgTrait = Object.values(persona.personalityTraits).reduce((a, b) => a + b, 0) / 5;
        if (avgTrait > 75) {
          newFeedback.push({ category: 'strength', text: 'Strong, well-defined personality profile.' });
        }
      }

      setFeedback(newFeedback);
      setIsGenerating(false);
    }, 1000);

    return newFeedback;
  };

  const enhancePersona = (persona: Partial<Persona>): Partial<Persona> => {
    const enhanced = { ...persona };

    if (!enhanced.quote && enhanced.name) {
      enhanced.quote = generateQuote(enhanced.name, enhanced.role || '');
    }

    if (!enhanced.preferredChannels && enhanced.role) {
      const channels: Record<string, string[]> = {
        'Product Manager': ['Slack', 'Email', 'Video calls'],
        'CEO': ['LinkedIn', 'Email', 'In-person'],
        'Designer': ['Figma', 'Slack', 'Video calls'],
        'Developer': ['GitHub', 'Slack', 'Email'],
      };
      const baseRole = Object.keys(channels).find(r => 
        enhanced.role?.toLowerCase().includes(r.toLowerCase())
      );
      if (baseRole) {
        enhanced.preferredChannels = channels[baseRole];
      }
    }

    if (!enhanced.brandValues && enhanced.role) {
      enhanced.brandValues = ['Quality', 'Innovation', 'User focus'];
    }

    return enhanced;
  };

  const addSuggestion = (suggestion: AISuggestion, persona: Partial<Persona>): Partial<Persona> => {
    const updated = { ...persona };
    
    switch (suggestion.type) {
      case 'goal':
        updated.goals = [...(updated.goals || []), suggestion.text];
        break;
      case 'painPoint':
        updated.painPoints = [...(updated.painPoints || []), suggestion.text];
        break;
      case 'motivation':
        updated.motivations = [...(updated.motivations || []), suggestion.text];
        break;
      case 'behavior':
        updated.behaviors = [...(updated.behaviors || []), suggestion.text];
        break;
      case 'channel':
        updated.preferredChannels = [...(updated.preferredChannels || []), suggestion.text];
        break;
      case 'value':
        updated.brandValues = [...(updated.brandValues || []), suggestion.text];
        break;
    }

    setSuggestions(prev => prev.filter(s => s.text !== suggestion.text));
    return updated;
  };

  return {
    isGenerating,
    suggestions,
    feedback,
    getSuggestions,
    generatePersona,
    generateAllVariations,
    analyzePersona,
    enhancePersona,
    addSuggestion,
    variationTypes,
    industries,
  };
};

export type { AISuggestion, AIFeedback };