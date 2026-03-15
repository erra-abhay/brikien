'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags = [], onChange, placeholder = "Type and press enter..." }: TagInputProps) {
  const [input, setInput] = useState('');

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="border border-border rounded-xl p-3 flex flex-wrap gap-2 items-center bg-background min-h-[48px] focus-within:ring-4 ring-primary/5 transition-all">
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-2 bg-muted text-[11px] font-bold px-3 py-1.5 rounded-lg border border-border">
          {tag}
          <button type="button" onClick={() => removeTag(i)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  );
}
