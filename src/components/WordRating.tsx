import React from 'react';

interface WordRatingProps {
  value: number;
  labels: Record<number, string>;
  onChange?: (value: number) => void;
  label?: string;
}

const WordRating: React.FC<WordRatingProps> = ({ value, labels, onChange, label }) => {
  return (
    <div>
      {label && (
        <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {Object.entries(labels).map(([n, word]) => {
          const num = parseInt(n);
          const isSelected = num === value;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange?.(num)}
              disabled={!onChange}
              className={`font-body text-sm italic transition-all duration-400
                ${isSelected
                  ? 'text-gold'
                  : 'text-warm-gray/30 hover:text-warm-gray/60'
                }
                ${onChange ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WordRating;
