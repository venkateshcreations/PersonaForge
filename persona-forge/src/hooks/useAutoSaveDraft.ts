import { useEffect, useRef, useCallback, useState } from 'react';
import type { Persona } from '../types';

const AUTOSAVE_DELAY = 2000;

export const useAutoSave = (
  persona: Partial<Persona> | undefined,
  onSave: (persona: Partial<Persona>) => void
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<string>('');

  const saveNow = useCallback(() => {
    if (!persona || Object.keys(persona).length === 0) return;
    
    const currentData = JSON.stringify(persona);
    if (currentData === previousDataRef.current) return;
    
    setIsSaving(true);
    previousDataRef.current = currentData;
    
    setTimeout(() => {
      onSave(persona);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 100);
  }, [persona, onSave]);

  useEffect(() => {
    if (!persona || Object.keys(persona).length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveNow();
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [persona, saveNow]);

  return { lastSaved, isSaving, saveNow };
};