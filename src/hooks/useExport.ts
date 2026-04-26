import { useState, useCallback, useRef } from 'react';
import type { Persona } from '../types';

export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const exportJSON = useCallback((persona: Persona) => {
    const data = JSON.stringify(persona, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${persona.name || 'persona'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportHTML = useCallback(async (persona: Persona) => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const element = previewRef.current;
      const clone = element.cloneNode(true) as HTMLElement;
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${persona.name || 'Persona'} - ${persona.role || ''}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: #f8f9fc; color: #101828; padding: 40px; line-height: 1.6; }
    .preview { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; 
               padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { display: flex; gap: 20px; margin-bottom: 24px; }
    .avatar { width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, #6C5CE7, #00C2FF);
             display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; overflow: hidden; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .role { color: #475467; font-size: 16px; }
    .section { margin-top: 24px; }
    .section h3 { font-size: 14px; color: #6C5CE7; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .stat { background: #f1f3f9; padding: 12px; border-radius: 8px; }
    .stat-label { font-size: 12px; color: #98A2B3; text-transform: uppercase; }
    .stat-value { font-weight: 500; }
    blockquote { border-left: 4px solid #6C5CE7; padding-left: 16px; font-style: italic; color: #475467; margin: 16px 0; }
    ul { list-style: none; }
    li { padding: 4px 0; color: #475467; }
    li::before { content: "✓ "; color: #22c55e; margin-right: 8px; }
    .pain li::before { content: "! "; color: #dc2626; }
    .chip { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; margin-right: 8px; margin-bottom: 8px; }
    .chip-green { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
    .chip-red { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .chip-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .chip-purple { background: rgba(108, 92, 231, 0.1); color: #6C5CE7; }
    .chip-amber { background: rgba(245, 158, 11, 0.1); color: #d97706; }
  </style>
</head>
<body>
  <div class="preview">
    <div class="header">
      <div class="avatar">
        ${persona.avatar ? `<img src="${persona.avatar}" alt="${persona.name}">` : (persona.name?.charAt(0) || '?')}
      </div>
      <div>
        <h1>${persona.name || 'Unnamed Persona'}</h1>
        <p class="role">${persona.role || 'Role not set'}</p>
      </div>
    </div>
    
    ${persona.quote ? `<blockquote>"${persona.quote}"</blockquote>` : ''}
    
    ${(persona.demographics?.age || persona.demographics?.location || persona.demographics?.income || persona.demographics?.education) ? `
    <div class="section">
      <h3>Demographics</h3>
      <div class="grid">
        ${persona.demographics?.age ? `<div class="stat"><div class="stat-label">Age</div><div class="stat-value">${persona.demographics.age}</div></div>` : ''}
        ${persona.demographics?.location ? `<div class="stat"><div class="stat-label">Location</div><div class="stat-value">${persona.demographics.location}</div></div>` : ''}
        ${persona.demographics?.income ? `<div class="stat"><div class="stat-label">Income</div><div class="stat-value">${persona.demographics.income}</div></div>` : ''}
        ${persona.demographics?.education ? `<div class="stat"><div class="stat-label">Education</div><div class="stat-value">${persona.demographics.education}</div></div>` : ''}
      </div>
    </div>
    ` : ''}
    
    ${persona.background ? `
    <div class="section">
      <h3>Background</h3>
      <p>${persona.background}</p>
    </div>
    ` : ''}
    
    ${(persona.goals && persona.goals.length) ? `
    <div class="section">
      <h3>Goals</h3>
      <ul>${persona.goals.map(g => `<li>${g}</li>`).join('')}</ul>
    </div>
    ` : ''}
    
    ${(persona.painPoints && persona.painPoints.length) ? `
    <div class="section">
      <h3>Pain Points</h3>
      <ul class="pain">${persona.painPoints.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
    ` : ''}
    
    ${(persona.motivations && persona.motivations.length) ? `
    <div class="section">
      <h3>Motivations</h3>
      <div>${persona.motivations.map(m => `<span class="chip chip-blue">${m}</span>`).join('')}</div>
    </div>
    ` : ''}
    
    ${(persona.behaviors && persona.behaviors.length) ? `
    <div class="section">
      <h3>Behaviors</h3>
      <div>${persona.behaviors.map(b => `<span class="chip chip-purple">${b}</span>`).join('')}</div>
    </div>
    ` : ''}
    
    ${(persona.preferredChannels && persona.preferredChannels.length) ? `
    <div class="section">
      <h3>Preferred Channels</h3>
      <div>${persona.preferredChannels.map(c => `<span class="chip chip-blue">${c}</span>`).join('')}</div>
    </div>
    ` : ''}
    
    ${(persona.brandValues && persona.brandValues.length) ? `
    <div class="section">
      <h3>Brand Values</h3>
      <div>${persona.brandValues.map(v => `<span class="chip chip-amber">${v}</span>`).join('')}</div>
    </div>
    ` : ''}
  </div>
</body>
</html>`;
      
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${persona.name || 'persona'}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('HTML error:', e);
    } finally {
      setExporting(false);
    }
  }, []);

  return { exportJSON, exportHTML, exporting, previewRef };
};