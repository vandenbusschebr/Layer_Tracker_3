import { MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { semantic, monoStyle } from '../lib/theme';

function TshirtIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 6l4-2 2 2c0 1.657 1.343 3 3 3s3-1.343 3-3l2-2 4 2-2 5h-3v9H8v-9H5L3 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconButtonStyle = {
  backgroundColor: semantic.overlay,
  boxShadow: semantic.buttonInsetShadow,
};

export default function Toolbar({ onOpenClothing, onOpenLog, onOpenFilter, activeFilterCount = 0 }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
      {/* Blurred backdrop — more blur at bottom, fades to zero at top via mask */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
          background: semantic.toolbarGradient,
        }}
      />
      <div className="relative pointer-events-auto flex items-center justify-center gap-8 py-4 px-12">
        <button
          onClick={onOpenClothing}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-opacity opacity-90 hover:opacity-80"
          style={{ ...iconButtonStyle, color: semantic.brand60 }}
        >
          <TshirtIcon />
        </button>

        <button
          onClick={onOpenLog}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-opacity opacity-90 hover:opacity-80"
          style={{
            backgroundColor: semantic.brand,
             boxShadow: semantic.buttonInsetShadow,
          }}
        >
          <PlusIcon width={24} height={24} color={semantic.primaryText} />
        </button>

        <button
          onClick={onOpenFilter}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-opacity opacity-90 hover:opacity-80 relative"
          style={{ ...iconButtonStyle, color: semantic.brand60 }}
        >
          <MixerHorizontalIcon width={20} height={20} />
          {activeFilterCount > 0 && (
            <span
              className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
              style={{ backgroundColor: semantic.brand, color: semantic.primaryText, ...monoStyle }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
