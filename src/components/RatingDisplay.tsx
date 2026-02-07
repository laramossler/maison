import React from 'react';

interface RatingDisplayProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ value, max = 5, onChange, label }) => {
  return (
    <div>
      {label && (
        <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
          {label}
        </span>
      )}
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            disabled={!onChange}
            className={`w-8 h-8 border transition-all duration-300 font-display text-sm
              ${n <= value
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-rule text-warm-gray/40 hover:border-gold/40'
              }
              ${onChange ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingDisplay;
