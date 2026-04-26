export interface ValidationRule {
  field: string;
  label: string;
  check: (persona: Record<string, unknown>) => boolean;
}

export const validationRules: ValidationRule[] = [
  {
    field: 'name',
    label: 'Name is required',
    check: (p) => !!p.name && (p.name as string).trim().length > 0,
  },
  {
    field: 'role',
    label: 'Role is required',
    check: (p) => !!p.role && (p.role as string).trim().length > 0,
  },
  {
    field: 'avatar',
    label: 'Avatar is recommended',
    check: (p) => !!p.avatar && (p.avatar as string).trim().length > 0,
  },
  {
    field: 'background',
    label: 'Background story is recommended',
    check: (p) => !!p.background && (p.background as string).trim().length > 0,
  },
  {
    field: 'goals',
    label: 'At least 1 goal',
    check: (p) => Array.isArray(p.goals) && (p.goals as string[]).length > 0,
  },
  {
    field: 'painPoints',
    label: 'At least 1 pain point',
    check: (p) => Array.isArray(p.painPoints) && (p.painPoints as string[]).length > 0,
  },
  {
    field: 'demographics',
    label: 'Demographics complete (age, location)',
    check: (p) => {
      const demos = p.demographics as Record<string, unknown> | undefined;
      return !!(demos?.age && demos?.location);
    },
  },
  {
    field: 'communicationStyle',
    label: 'Communication style is set',
    check: (p) => !!p.communicationStyle && (p.communicationStyle as string).trim().length > 0,
  },
];

export const validatePersona = (persona: Record<string, unknown>): { valid: boolean; results: { rule: ValidationRule; passed: boolean }[] } => {
  const results = validationRules.map((rule) => ({
    rule,
    passed: rule.check(persona),
  }));

  const valid = results.every((r) => r.passed);

  return { valid, results };
};

export const getValidationScore = (persona: Record<string, unknown>): number => {
  const { results } = validatePersona(persona);
  const passed = results.filter((r) => r.passed).length;
  return Math.round((passed / results.length) * 100);
};