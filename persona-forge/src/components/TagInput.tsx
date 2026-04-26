import { useState } from 'react';
import { X, Tag } from 'lucide-react';
import type { Persona } from '../types';

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

const suggestions = ['Marketing', 'Sales', 'Engineering', 'Product', 'Design', 'Support', 'Finance', 'HR', 'Executive', 'Customer'];

export const TagInput = ({ tags, onAdd, onRemove }: TagInputProps) => {
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAdd(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const availableSuggestions = suggestions.filter(s => !tags.includes(s));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-[var(--accent)]" />
        <span className="text-sm font-medium">Tags</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
              className="hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="input-field flex-1"
        />
        <button onClick={handleAdd} className="btn-primary px-3">
          <X className="w-4 h-4" />
        </button>
      </div>

      {availableSuggestions.length > 0 && tags.length < 5 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-[var(--text-secondary)]">Suggestions:</span>
          {availableSuggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              onClick={() => onAdd(s)}
              className="text-xs px-2 py-0.5 bg-[var(--bg-secondary)] rounded-full hover:bg-[var(--border)]"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};