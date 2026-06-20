import { semantic, fonts, monoStyle, labelStyle as LABEL_STYLE, headingStyle as HEADING_STYLE, feelConfig } from '../lib/theme';

const TEMP_MIN = -32;
const TEMP_MAX = 120;

function TempRangeSlider({ value, onChange }) {
  const [lo, hi] = value;
  const pct = v => ((v - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100;
  const midPct = (pct(lo) + pct(hi)) / 2;

  return (
    <div>
      <div className="flex justify-between mb-3" style={{ ...monoStyle, fontSize: '13px', color: semantic.primaryText }}>
        <span>{lo}°</span>
        <span>{hi}°</span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 h-1 rounded-full" style={{ backgroundColor: semantic.inputBorder }} />
        {/* Active fill */}
        <div
          className="absolute h-1 rounded-full"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%`, backgroundColor: semantic.brand }}
        />
        {/* Min thumb — covers left half of track */}
        <input
          type="range"
          min={TEMP_MIN} max={TEMP_MAX} value={lo}
          onChange={e => onChange([Math.min(Number(e.target.value), hi - 1), hi])}
          className="absolute w-full appearance-none bg-transparent"
          style={{
            zIndex: 3,
            clipPath: `inset(0 ${100 - midPct}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - midPct}% 0 0)`,
          }}
        />
        {/* Max thumb — covers right half of track */}
        <input
          type="range"
          min={TEMP_MIN} max={TEMP_MAX} value={hi}
          onChange={e => onChange([lo, Math.max(Number(e.target.value), lo + 1)])}
          className="absolute w-full appearance-none bg-transparent"
          style={{
            zIndex: 3,
            clipPath: `inset(0 0 0 ${midPct}%)`,
            WebkitClipPath: `inset(0 0 0 ${midPct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1" style={{ ...monoStyle, fontSize: '10px', color: semantic.mutedText }}>
        <span>{TEMP_MIN}°</span>
        <span>{TEMP_MAX}°</span>
      </div>
      <style>{`
        input[type=range].appearance-none::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: ${semantic.brand};
          border: 2px solid ${semantic.drawerBg};
          cursor: pointer;
          box-shadow: 0 0 6px ${semantic.brand}80;
        }
        input[type=range].appearance-none::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: ${semantic.brand};
          border: 2px solid ${semantic.drawerBg};
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date: Most Recent' },
  { value: 'date-asc',  label: 'Date: Oldest' },
  { value: 'location',  label: 'Location: A to Z' },
];

const ACTIVITY_TYPES = [
  { label: 'Hike',          emoji: '🥾' },
  { label: 'Mountain Bike', emoji: '🚵' },
  { label: 'Snowboarding',  emoji: '🏂' },
  { label: 'Trail Run',     emoji: '🏃' },
  { label: 'Skiing',        emoji: '⛷️' },
  { label: 'Climbing',      emoji: '🧗' },
];

const FEEL_OPTIONS = Object.entries(feelConfig).map(([label, cfg]) => ({
  label,
  emoji: cfg.label.split(' ')[0],
  activeColor: cfg.activeColor,
  activeBorder: cfg.activeBorder,
}));

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

export default function FilterDrawer({ open, onClose, filters, onChange }) {
  function handleReset() {
    onChange({ sort: 'date-desc', types: [], feels: [], tempRange: [TEMP_MIN, TEMP_MAX] });
  }

  const tempRange = filters.tempRange ?? [TEMP_MIN, TEMP_MAX];
  const activeFilterCount = filters.types.length + filters.feels.length +
    (tempRange[0] !== TEMP_MIN || tempRange[1] !== TEMP_MAX ? 1 : 0);

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: semantic.backdrop,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl"
        style={{
          backgroundColor: semantic.drawerBg,
          height: '80vh',
          maxHeight: '1000px',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Title row */}
        <div className="px-5 pt-5 pb-4 shrink-0 flex items-center justify-between">
          <h2 className="text-3xl" style={{ ...HEADING_STYLE, color: semantic.primaryText }}>FILTER</h2>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                style={{
                  ...monoStyle,
                  fontSize: '12px',
                  color: semantic.brand,
                  letterSpacing: '0.04em',
                }}
              >
                RESET
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ backgroundColor: semantic.inputBg, border: `1px solid ${semantic.inputBorder}` }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke={semantic.brand} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 space-y-6" style={{ paddingBottom: '88px' }}>

          {/* Sort */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Sort</p>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={e => onChange({ ...filters, sort: e.target.value })}
                style={{
                  ...monoStyle,
                  fontSize: '14px',
                  backgroundColor: semantic.inputBg,
                  border: `1px solid ${semantic.inputBorder}`,
                  borderRadius: '8px',
                  color: semantic.primaryText,
                  padding: '10px 40px 10px 12px',
                  width: '100%',
                  outline: 'none',
                  colorScheme: 'dark',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
              >
                <path d="M6 9l6 6 6-6" stroke={semantic.brand60} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Filter: Activity Type */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Activity Type</p>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_TYPES.map(t => {
                const active = filters.types.includes(t.label);
                return (
                  <button
                    key={t.label}
                    onClick={() => onChange({ ...filters, types: toggle(filters.types, t.label) })}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                    style={{
                      ...monoStyle,
                      backgroundColor: active ? semantic.brandActive : semantic.inputBg,
                      border: active ? `1px solid ${semantic.brand}` : `1px solid ${semantic.inputBorder}`,
                      color: active ? semantic.primaryText : semantic.labelText,
                    }}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter: Feel */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Feel</p>
            <div className="flex gap-2">
              {FEEL_OPTIONS.map(f => {
                const active = filters.feels.includes(f.label);
                return (
                  <button
                    key={f.label}
                    onClick={() => onChange({ ...filters, feels: toggle(filters.feels, f.label) })}
                    className="flex-1 py-2 rounded-lg text-sm transition-all"
                    style={{
                      ...monoStyle,
                      backgroundColor: active ? f.activeColor : semantic.inputBg,
                      border: active ? `1px solid ${f.activeBorder}` : `1px solid ${semantic.inputBorder}`,
                      color: active ? semantic.primaryText : semantic.labelText,
                    }}
                  >
                    {f.emoji} {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <p className="mb-3" style={LABEL_STYLE}>Temperature</p>
            <TempRangeSlider
              value={filters.tempRange ?? [TEMP_MIN, TEMP_MAX]}
              onChange={v => onChange({ ...filters, tempRange: v })}
            />
          </div>

        </div>

        <div className="pb-6 shrink-0" />
      </div>

      {/* Floating Apply button */}
      {open && (
        <div className="fixed bottom-6 left-0 right-0 px-5 z-50" style={{ pointerEvents: 'none' }}>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl text-xl transition-opacity hover:opacity-80"
            style={{
              ...HEADING_STYLE,
              pointerEvents: 'auto',
              backgroundColor: semantic.brand,
              color: semantic.primaryText,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 4px 16px rgba(75,141,133,0.4)',
            }}
          >
            APPLY
          </button>
        </div>
      )}
    </>
  );
}
