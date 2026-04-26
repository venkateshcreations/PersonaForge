# Persona Schema (Detailed)

## 1. Core Structure

Persona Object:

{
  id: string,
  createdAt: timestamp,
  updatedAt: timestamp,

  basicInfo: {},
  demographics: {},
  goals: {},
  painPoints: {},
  behavior: {},
  personality: {},
  needs: {},
  narrative: {},
  metadata: {}
}

---

## 2. Basic Info

Fields:
- name: string (required)
- avatar: image | generated avatar
- age: number (range: 10–80)
- gender: enum [male, female, non-binary, prefer-not]
- location: string
- occupation: string

UX Rules:
- Name auto-suggest option
- Avatar fallback if none uploaded
- Age slider + numeric input

Edge Cases:
- Empty name → block save
- No avatar → auto-generate initials

---

## 3. Demographics

Fields:
- education: enum
- incomeRange: enum
- familyStatus: enum
- deviceUsage: multi-select

---

## 4. Goals

Structure:
- primaryGoals: string[]
- secondaryGoals: string[]
- successDefinition: string

UX:
- Tag-based input
- AI suggestions

---

## 5. Pain Points

Fields:
- frustrations: string[]
- blockers: string[]
- risks: string[]

---

## 6. Behavior

Fields:
- digitalLiteracy: scale (1–5)
- productUsageFrequency: enum
- dailyRoutine: text
- preferredPlatforms: multi-select

---

## 7. Personality

Model:
- introversion: 0–100
- logicVsEmotion: 0–100
- spontaneity: 0–100

Visualization:
- Radar chart

---

## 8. Needs

- functionalNeeds: string[]
- emotionalNeeds: string[]

---

## 9. Narrative

- quote: string
- story: paragraph

AI Support:
- Generate quote button
- Generate story button

---

## 10. Metadata

- tags: string[]
- templateUsed: string
- completenessScore: number (auto-calculated)

---

## 11. Completeness Algorithm

Score based on:
- Required fields filled
- Sections completed

Example:
score = (filledFields / totalFields) * 100