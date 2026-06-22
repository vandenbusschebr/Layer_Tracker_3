import { useTheme } from '../lib/ThemeContext';

export default function CloseButton({ onClick, className = '' }) {
  const { semantic, themeName } = useTheme();
  const isNP = themeName === 'nationalPark';

  const style = isNP
    ? { backgroundColor: semantic.brand, border: 'none', boxShadow: 'inset 2px 2px 0 0 rgba(0,0,0,0.25)' }
    : { backgroundColor: semantic.inputBg, border: `1px solid ${semantic.inputBorder}` };

  const iconColor = isNP ? semantic.textLight : semantic.primaryText;

  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-70 ${className}`}
      style={style}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
