import { semantic, monoStyle } from '../lib/theme';

export default function ClothingPicker({ items, selected, onToggle }) {
  if (!items.length) {
    return (
      <p style={{ ...monoStyle, color: semantic.mutedText, fontSize: '12px' }}>
        No items in your gear library yet.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(item => {
        const isSelected = selected.includes(item.id);
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="flex flex-col items-center gap-1"
            style={{ width: '64px' }}
          >
            <div
              className="w-14 h-14 rounded-full overflow-hidden relative"
              style={{
                border: isSelected ? `2px solid ${semantic.brand}` : `2px solid ${semantic.divider}`,
                boxShadow: isSelected ? `0 0 10px ${semantic.brand}80` : 'none',
              }}
            >
              {item.imageUrl ? (
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: semantic.imageFallbackBg, color: semantic.mutedText }}
                >
                  ?
                </div>
              )}
              {isSelected && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: semantic.selectedOverlay }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke={semantic.primaryText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
            <span
              className="text-center leading-tight"
              style={{
                ...monoStyle,
                fontSize: '10px',
                color: isSelected ? semantic.brand60 : semantic.labelText,
                wordBreak: 'break-word',
              }}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
