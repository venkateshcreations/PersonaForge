# User Flows (Detailed)

## 1. Create Persona (Manual)

Steps:
1. Click "Create Persona"
2. Choose "Blank"
3. Fill sections step-by-step
4. Live preview updates
5. Save

States:
- Empty
- Partial
- Completed

Edge Cases:
- User leaves mid-way → autosave
- Invalid inputs → inline validation

---

## 2. Create Persona (AI)

Steps:
1. Click "Generate with AI"
2. Input:
   - Product type
   - Audience
   - Goals
3. AI generates persona(s)
4. User edits

States:
- Loading
- Generated
- Error (retry)

---

## 3. Compare Personas

Steps:
1. Select 2–4 personas
2. Click "Compare"
3. System highlights:
   - Goals differences
   - Behavior patterns
   - Personality contrast

---

## 4. Export Flow

Options:
- PDF
- PNG
- JSON

Edge Cases:
- Large persona → paginate PDF
- Missing images → fallback layout

## Error States

- AI failure → fallback to template
- Storage full → prompt cleanup

## Recovery

- Auto-save every 5 seconds
- Undo/redo stack (last 20 actions)