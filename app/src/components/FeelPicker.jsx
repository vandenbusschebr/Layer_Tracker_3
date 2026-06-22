import { useTheme } from '../lib/ThemeContext';

export default function FeelPicker({ selected, onToggle }) {
  const { semantic, fonts, feelConfig, themeName } = useTheme();
  const monoStyle = { fontFamily: fonts.mono, fontWeight: 800 };
  const isNP = themeName === 'nationalPark';

  const options = Object.entries(feelConfig).map(([label, cfg]) => ({
    label,
    emoji: cfg.label.split(' ')[0],
    feelColor: cfg.color,
    activeColor: cfg.activeColor,
  }));

  function isActive(label) {
    return Array.isArray(selected) ? selected.includes(label) : selected === label;
  }

  return (
    <div className="flex gap-2">
      {options.map(f => {
        const active = isActive(f.label);
        return (
          <button
            key={f.label}
            onClick={() => onToggle(f.label)}
            className="flex-1 py-2 rounded-lg text-sm transition-all"
            style={{
              ...monoStyle,
              backgroundColor: active ? (isNP ? f.feelColor : f.activeColor) : semantic.inputBg,
              border: active ? `1px solid ${f.feelColor}` : `1px solid ${semantic.inputBorder}`,
              color: active ? (isNP ? semantic.textLight : semantic.primaryText) : (isNP ? f.feelColor : semantic.labelText),
            }}
          >
            {f.emoji} {f.label}
          </button>
        );
      })}
    </div>
  );
}
