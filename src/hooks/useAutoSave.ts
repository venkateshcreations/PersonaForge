import { useEffect, useRef } from 'react';

interface UseAutoSaveProps {
  value: unknown;
  onSave: (value: unknown) => void;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ value, onSave, delay = 5000, enabled = true }: UseAutoSaveProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevValueRef = useRef<string | null>(null);
  const valueRef = useRef(value);
  const onSaveRef = useRef(onSave);

  valueRef.current = value;
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) return;

    const currentJson = JSON.stringify(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set up auto-save if value actually changed
    if (currentJson !== prevValueRef.current) {
      prevValueRef.current = currentJson;
      
      timeoutRef.current = setTimeout(() => {
        onSaveRef.current(valueRef.current);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, enabled]);

  return { 
    saveNow: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onSaveRef.current(valueRef.current);
    }
  };
};

interface UseUndoRedoProps {
  initialValue: unknown;
  maxHistory?: number;
}

export const useUndoRedo = ({ initialValue, maxHistory = 20 }: UseUndoRedoProps) => {
  const historyRef = useRef<unknown[]>([initialValue]);
  const indexRef = useRef(0);

  const push = (value: unknown) => {
    historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
    historyRef.current.push(value);
    
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift();
    } else {
      indexRef.current++;
    }
  };

  const undo = () => {
    if (indexRef.current > 0) {
      indexRef.current--;
      return historyRef.current[indexRef.current];
    }
    return historyRef.current[0];
  };

  const redo = () => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      return historyRef.current[indexRef.current];
    }
    return historyRef.current[indexRef.current];
  };

  const canUndo = () => indexRef.current > 0;
  const canRedo = () => indexRef.current < historyRef.current.length - 1;

  return { push, undo, redo, canUndo, canRedo };
};