# System Overview

## 1. System Layers

### 1. Input Layer
- Persona builder forms
- AI prompt inputs
- Template selection

### 2. Processing Layer
- State management (global store)
- Persona transformation logic
- AI processing (optional async)

### 3. Visualization Layer
- Persona cards
- Comparison tables
- Charts (Radar, Bar)

### 4. Output Layer
- Export engine
- Share-ready layouts

### 5. Storage Layer
- LocalStorage (MVP)
- IndexedDB (scalable mode)

---

## 2. Data Flow

User Input → State Store → Derived Data → UI Render → Export

---

## 3. Key Constraints

- No backend dependency
- All operations must work offline
- AI must be optional and non-blocking

---

## 4. Performance Goals

- Initial load < 2s
- Persona render < 100ms
- Export generation < 3s