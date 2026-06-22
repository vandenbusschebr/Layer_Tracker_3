import { useTheme } from '../lib/ThemeContext';

export default function ActivityCard({ activity, clothingCatalog = [] }) {
  const { semantic, fonts, feelConfig, themeName } = useTheme();
  const monoStyle = { fontFamily: fonts.mono, fontWeight: 800 };
  const { type, typeEmoji, location, feel, weather, baseLayers, outerwear } = activity;
  const feelCfg = feelConfig[feel] ?? feelConfig.Stoked;

  function resolveItems(ids) {
    if (!ids?.length) return [];
    return ids.map(entry => {
      if (typeof entry === 'object' && entry !== null) return entry;
      return clothingCatalog.find(c => c.id === entry) ?? { name: entry, imageUrl: '' };
    });
  }

  const resolvedBaseLayers = resolveItems(baseLayers);
  const resolvedOuterwear = resolveItems(outerwear);

  if (themeName === 'nationalPark') {
    return <NPActivityCard
      type={type} typeEmoji={typeEmoji} location={location} feel={feel}
      feelCfg={feelCfg} weather={weather}
      baseLayers={resolvedBaseLayers} outerwear={resolvedOuterwear}
      semantic={semantic} fonts={fonts} monoStyle={monoStyle}
    />;
  }

  return (
    <div
      className="rounded-sm p-4 mb-1 mx-auto w-full"
      style={{
        maxWidth: '600px',
        background: semantic.cardGradient,
        boxShadow: `-3px -6px 24px 0 ${feelCfg.shadow}66`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeEmoji}</span>
          <span className="font-mono text-xs font-medium uppercase tracking-wide" style={{ color: semantic.labelText }}>{type}</span>
        </div>
        <span
          className="shrink-0 inline-flex items-center px-3 py-1 rounded-sm text-sm"
          style={{ ...monoStyle, backgroundColor: feelCfg.activeColor, color: semantic.primaryText, userSelect: 'none' }}
        >
          {feelCfg.label}
        </span>
      </div>

      <div className="mb-1">
        <h2 className="text-2xl leading-none" style={{ fontFamily: fonts.heading, letterSpacing: '0.02em', color: semantic.primaryText }}>
          {location.toUpperCase()}
        </h2>
      </div>

      <div style={{ height: '2px', margin: '8px 0 8px', background: `linear-gradient(to right, transparent 0%, ${feelCfg.color} 50%, transparent 100%)` }} />

      <div className="grid grid-cols-3 gap-2 mb-2 w-full">
        <WeatherChip semantic={semantic} monoStyle={monoStyle}>{String(weather.temp).replace(/\s*°?F$/i, '')}<span style={{ color: semantic.labelText }}>°F</span></WeatherChip>
        <WeatherChip semantic={semantic} monoStyle={monoStyle} large>{weather.skies}</WeatherChip>
        <WeatherChip semantic={semantic} monoStyle={monoStyle}>{weather.wind}</WeatherChip>
      </div>

      <div className="flex gap-6">
        <LayerColumn title="Base Layers" items={resolvedBaseLayers} semantic={semantic} monoStyle={monoStyle} uppercase />
        <LayerColumn title="Outerwear" items={resolvedOuterwear} semantic={semantic} monoStyle={monoStyle} uppercase />
      </div>
    </div>
  );
}

function WeatherChip({ children, semantic, monoStyle, large }) {
  return (
    <span
      className={`font-medium px-3 py-1 rounded-sm flex items-center justify-center gap-1 ${large ? 'text-xl' : 'text-xs'}`}
      style={{ backgroundColor: semantic.inputBg, color: semantic.primaryText, ...monoStyle }}
    >
      {children}
    </span>
  );
}

function NPActivityCard({ type, typeEmoji, location, feel, feelCfg, weather, baseLayers, outerwear, semantic, fonts, monoStyle }) {
  const lightMonoStyle = { ...monoStyle, fontWeight: 500 };
  return (
    <div
      className="overflow-hidden mx-auto w-full"
      style={{
        maxWidth: '600px',
        border: `2px solid ${semantic.primaryText}`,
        boxShadow: `0 4px 20px rgba(20,9,0,0.15)`,
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
      }}
    >
      {/* Dark brown header */}
      <div
        className="px-4 pt-3 pb-2 relative"
        style={{ backgroundColor: semantic.elementDark }}
      >
        {/* Feel badge — top right */}
        <div className="absolute top-4 right-4">
          {(() => {
            const parts = feelCfg.label.split(' ');
            const emoji = parts[0];
            const word = parts.slice(1).join(' ');
            return (
              <span
                className="inline-flex flex-col items-center px-5 py-1"
                style={{
                  backgroundColor: feelCfg.color,
                  color: semantic.textLight,
                  borderRadius: '24px',
                  userSelect: 'none',
                  border: `2px solid ${semantic.textLight}`,
                  boxShadow: 'inset 4px 4px 0 0 rgba(0,0,0,0.25)',
                  minWidth: '80px',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1.2 }}>{emoji}</span>
                <span style={{ fontFamily: fonts.heading, fontSize: '16px', letterSpacing: '0.01em' }}>{word}</span>
              </span>
            );
          })()}
        </div>

        {/* Activity type */}
        <div className="flex items-center gap-2 pr-24">
          <span className="text-lg">{typeEmoji}</span>
          <span style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: '14px', color: semantic.textLight }}>{type}</span>
        </div>

        {/* Location */}
        <h2
          className="leading-tight pr-24"
          style={{ fontFamily: fonts.heading, fontSize: '36px', color: semantic.textLight, letterSpacing: '0.01em' }}
        >
          {location}
        </h2>
      </div>

      {/* Cream body */}
      <div className="px-4 pt-4 pb-4" style={{ backgroundColor: semantic.element }}>
        {/* Weather chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <span className="text-sm px-3 py-1 rounded-lg flex items-center justify-center gap-1"
            style={{ backgroundColor: semantic.inputBorder, color: semantic.primaryText, fontFamily: fonts.mono, fontWeight: 700 }}>
            {String(weather.temp).replace(/\s*°?F$/i, '')}<span style={{ color: semantic.primaryText, fontWeight: 500 }}> F</span>
          </span>
          <span className="text-xl px-6 py-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: semantic.inputBorder, color: semantic.primaryText }}>
            <span style={{ display: 'inline-block', transform: 'scale(1.4)', lineHeight: 1 }}>{weather.skies}</span>
          </span>
          <span className="text-sm px-3 py-1 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: semantic.inputBorder, color: semantic.primaryText, fontFamily: fonts.mono, fontWeight: 700 }}>
            {weather.wind}
          </span>
        </div>

        {/* Layers */}
        <div className="flex gap-6">
          <LayerColumn title="Base Layers" items={baseLayers} semantic={semantic} monoStyle={lightMonoStyle} labelColor={semantic.primaryText} itemColor={semantic.primaryText} boldLabel />
          <LayerColumn title="Outerwear" items={outerwear} semantic={semantic} monoStyle={lightMonoStyle} labelColor={semantic.primaryText} itemColor={semantic.primaryText} boldLabel />
        </div>
      </div>
    </div>
  );
}

function LayerColumn({ title, items, semantic, monoStyle, uppercase, labelColor, itemColor, boldLabel }) {
  return (
    <div className="flex-1">
      <p
        className="text-xs font-medium mb-2 tracking-wide"
        style={{ ...monoStyle, fontWeight: boldLabel ? 800 : monoStyle.fontWeight, color: labelColor ?? semantic.labelText, textTransform: uppercase ? 'uppercase' : 'none', letterSpacing: uppercase ? '0.08em' : '0' }}
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
            <span className="text-sm font-medium" style={{ ...monoStyle, color: itemColor ?? semantic.primaryText }}>
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
