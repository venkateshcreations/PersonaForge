import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNew?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onPresent?: () => void;
}

export const useKeyboardShortcuts = ({
  onSave,
  onUndo,
  onRedo,
  onNew,
  onDuplicate,
  onDelete,
  onPresent,
}: KeyboardShortcutsOptions) => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Ctrl/Cmd + key combinations
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          onSave?.();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            onRedo?.();
          } else {
            onUndo?.();
          }
          break;
        case 'y':
          e.preventDefault();
          onRedo?.();
          break;
        case 'n':
          e.preventDefault();
          onNew?.();
          break;
        case 'd':
          e.preventDefault();
          onDuplicate?.();
          break;
        case 'delete':
        case 'backspace':
          e.preventDefault();
          if (e.shiftKey) {
            onDelete?.();
          }
          break;
        case 'p':
          e.preventDefault();
          onPresent?.();
          break;
      }
    }

    // Navigation shortcuts (without Ctrl)
    switch (e.key) {
      case 'g':
        if (!e.ctrlKey && !e.metaKey) {
          navigate('/');
        }
        break;
      case 'b':
        if (!e.ctrlKey && !e.metaKey) {
          navigate('/builder');
        }
        break;
      case 't':
        if (!e.ctrlKey && !e.metaKey) {
          navigate('/templates');
        }
        break;
      case 'a':
        if (!e.ctrlKey && !e.metaKey) {
          navigate('/analytics');
        }
        break;
      case 'm':
        if (!e.ctrlKey && !e.metaKey) {
          navigate('/team');
        }
        break;
      case 'c':
        if (!e.ctrlKey && !e.metaKey) {
          navigate('/compare');
        }
        break;
      case '?':
        if (!e.ctrlKey && !e.metaKey) {
          // Toggle help - handled by component
        }
        break;
    }
  }, [navigate, onSave, onUndo, onRedo, onNew, onDuplicate, onDelete, onPresent]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const SHORTCUTS = [
  { keys: 'Ctrl + S', action: 'Save' },
  { keys: 'Ctrl + Z', action: 'Undo' },
  { keys: 'Ctrl + Y / Shift + Ctrl + Z', action: 'Redo' },
  { keys: 'Ctrl + N', action: 'New Persona' },
  { keys: 'Ctrl + D', action: 'Duplicate' },
  { keys: 'Ctrl + P', action: 'Present' },
  { keys: 'Ctrl + Shift + Delete', action: 'Delete' },
  { keys: 'G', action: 'Go to Dashboard' },
  { keys: 'B', action: 'Go to Builder' },
  { keys: 'T', action: 'Go to Templates' },
  { keys: 'A', action: 'Go to Analytics' },
  { keys: 'M', action: 'Go to Team' },
  { keys: 'C', action: 'Go to Compare' },
  { keys: '?', action: 'Show Shortcuts' },
];