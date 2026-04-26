import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  onEscape?: () => void;
}

export const useKeyboardNavigation = ({ onNext, onPrev, onEscape }: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        onNext?.();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        onPrev?.();
      } else if (e.key === 'Escape') {
        onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onEscape]);
};