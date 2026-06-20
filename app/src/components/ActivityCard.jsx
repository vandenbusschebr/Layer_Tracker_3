import { semantic, fonts, monoStyle, feelConfig as FEEL_CONFIG } from '../lib/theme';

function FeelBadge({ cfg }) {
  return (
    <span
      className="shrink-0 inline-flex items-center px-3 py-1 rounded-sm text-sm"
      style={{
        ...monoStyle,
        backgroundColor: cfg.activeColor,
        color: semantic.primaryText,
        userSelect: 'none',
      }}
    >
      {cfg.label}
    </span>
  );
}

export default function ActivityCard({ activity, clothingCatalog = [] }) {
  const { type, typeEmoji, location, feel, weather, baseLayers, outerwear } = activity;
  const feelCfg = FEEL_CONFIG[feel] ?? FEEL_CONFIG.Stoked;

  function resolveItems(ids) {
    if (!ids?.length) return [];
    return ids.map(entry => {
      if (typeof entry === 'object' && entry !== null) return entry;
      return clothingCatalog.find(c => c.id === entry) ?? { name: entry, imageUrl: '' };
    });
  }

  const resolvedBaseLayers = resolveItems(baseLayers);
  const resolvedOuterwear = resolveItems(outerwear);

  return (
    <>
      <div
        className="rounded-sm p-4 mb-1"
        style={{
          background: semantic.cardGradient,
          boxShadow: `-3px -6px 24px 0 ${feelCfg.shadow}66`,
        }}
      >
        {/* Activity type + feel badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeEmoji}</span>
            <span className="font-mono text-xs font-medium uppercase tracking-wide" style={{ color: semantic.labelText }}>{type}</span>
          </div>
          <FeelBadge cfg={feelCfg} />
        </div>

        {/* Location */}
        <div className="mb-1">
          <h2
            className="text-2xl leading-none"
            style={{ fontFamily: fonts.heading, letterSpacing: '0.02em' }}
          >
            {location.toUpperCase()}
          </h2>
        </div>

        {/* Feel divider */}
        <div style={{
          height: '2px',
          margin: '8px 0 8px',
          background: `linear-gradient(to right, transparent 0%, ${feelCfg.color} 50%, transparent 100%)`,
        }} />

        {/* Weather row */}
        <div className="grid grid-cols-3 gap-2 mb-2 w-full">
          <span
            className="text-xs font-medium px-3 py-1 rounded-sm flex items-center justify-center gap-1"
            style={{ backgroundColor: semantic.inputBg, color: semantic.primaryText, ...monoStyle }}
          >
            {String(weather.temp).replace(/\s*°?F$/i, '')}<span style={{ color: semantic.labelText }}>°F</span>
          </span>
          <span
            className="text-xl font-medium px-3 py-1 rounded-sm flex items-center justify-center"
            style={{ backgroundColor: semantic.inputBg, color: semantic.primaryText, ...monoStyle }}
          >
            {` ${weather.skies}`}
          </span>
          <span
            className="text-xs font-medium px-3 py-1 rounded-sm flex items-center justify-center"
            style={{ backgroundColor: semantic.inputBg, color: semantic.primaryText, ...monoStyle }}
          >
            {` ${weather.wind}`}
          </span>
        </div>

        {/* Layers */}
        <div className="flex gap-6">
          <LayerColumn title="Base Layers" items={resolvedBaseLayers} />
          <LayerColumn title="Outerwear" items={resolvedOuterwear} />
        </div>
      </div>
    </>
  );
}

function LayerColumn({ title, items }) {
  return (
    <div className="flex-1">
      <p
        className="text-xs font-medium mb-2 uppercase tracking-wide"
        style={{ ...monoStyle, color: semantic.labelText }}
      >
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-3">
            {item.imageUrl ? (
              <img
                src={item.imageUrl.startsWith('data:') ? item.imageUrl : `/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`}
                alt={item.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                style={{ border: `1px solid ${semantic.divider}` }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs"
                style={{ backgroundColor: semantic.imageFallbackBg, border: `1px solid ${semantic.divider}`, color: semantic.mutedText }}
              >
                ?
              </div>
            )}
            <span className="text-sm font-medium" style={{ ...monoStyle, color: semantic.primaryText }}>
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
