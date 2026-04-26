# Frontend Architecture

## 1. App Structure

/src
  /components
  /modules
  /store
  /utils
  /hooks
  /views

---

## 2. Modules

- Dashboard
- Persona Builder
- AI Generator
- Comparison Engine
- Export Engine

---

## 3. State Design

Global Store:

{
  personas: [],
  selectedPersona: {},
  uiState: {},
  filters: {}
}

---

## 4. Data Flow

Input → Store → UI Render → Export

---

## 5. Performance

- Lazy load charts
- Debounce inputs
- Memoized components

---

## 6. Offline Support

- Cache personas
- No API dependency (optional AI toggle)

---

## 7. Security

- No external data leakage
- All processing client-side

## Code Splitting

- Lazy load:
  - Charts
  - Export module

## Folder Rules

- One module = one folder