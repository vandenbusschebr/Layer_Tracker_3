import { useState, useEffect, useRef } from 'react';
import { createActivity } from '../lib/api';
import { semantic, monoStyle, labelStyle as LABEL_STYLE, inputStyle as INPUT_STYLE, headingStyle as HEADING_STYLE, feelConfig } from '../lib/theme';
import ClothingPicker from './ClothingPicker';

const ACTIVITY_TYPES = [
  { label: 'Hike', emoji: '🥾' },
  { label: 'Mountain Bike', emoji: '🚵' },
  { label: 'Snowboarding', emoji: '🏂' },
  { label: 'Trail Run', emoji: '🏃' },
  { label: 'Skiing', emoji: '⛷️' },
  { label: 'Climbing', emoji: '🧗' },
];

const FEEL_OPTIONS = Object.entries(feelConfig).map(([label, cfg]) => ({
  label,
  emoji: cfg.label.split(' ')[0],
  activeColor: cfg.activeColor,
  activeBorder: cfg.activeBorder,
  activeText: semantic.primaryText,
}));

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}


export default function LogActivityDrawer({ open, onClose, clothingCatalog = [], onSaved }) {
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]);
  const [date, setDate] = useState(today());
  const [location, setLocation] = useState('');
  const [feel, setFeel] = useState('Stoked');
  const [temp, setTemp] = useState('');
  const [wind, setWind] = useState('');
  const [skies, setSkies] = useState('');
  const [selectedBaseLayers, setSelectedBaseLayers] = useState([]);
  const [selectedOuterwear, setSelectedOuterwear] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const startY = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setActivityType(ACTIVITY_TYPES[0]);
      setDate(today());
      setLocation('');
      setFeel('Stoked');
      setTemp('');
      setWind('');
      setSkies('');
      setSelectedBaseLayers([]);
      setSelectedOuterwear([]);
      setSaving(false);
      setErrors({});
    }
  }, [open]);

  function handleTouchStart(e) {
    startY.current = e.touches[0].clientY;
  }
  function handleTouchEnd(e) {
    const delta = e.changedTouches[0].clientY - startY.current;
    if (delta > 60) onClose();
  }

  function toggleBaseLayer(id) {
    setSelectedBaseLayers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleOuterwear(id) {
    setSelectedOuterwear(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function handleSave() {
    const errs = {};
    if (!location.trim()) errs.location = 'Location required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    try {
      const saved = await createActivity({
        date,
        type: activityType.label,
        typeEmoji: activityType.emoji,
        location: location.trim(),
        feel,
        weather: { temp: temp.trim(), wind: wind.trim(), skies: skies.trim() },
        baseLayers: selectedBaseLayers,
        outerwear: selectedOuterwear,
      });
      onSaved(saved);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const baseLayers = clothingCatalog.filter(i => i.category === 'Base Layer');
  const outerwear = clothingCatalog.filter(i => i.category === 'Outerwear');

  return (
    <>
      {/* Full-screen panel */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundColor: semantic.drawerBg,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Title row with close button */}
        <div className="px-5 pt-12 pb-4 shrink-0 flex items-center justify-between">
          <h2 className="text-3xl" style={{ ...HEADING_STYLE, color: semantic.primaryText }}>LOG ACTIVITY</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
            style={{ backgroundColor: semantic.inputBg, border: `1px solid ${semantic.inputBorder}` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke={semantic.labelText} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 pb-8 space-y-6">

          {/* Date */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Date</p>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ ...INPUT_STYLE, colorScheme: 'dark' }}
            />
          </div>

          {/* Location */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Location</p>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Bear Peak"
              style={{
                ...INPUT_STYLE,
                border: errors.location ? `1px solid ${semantic.error}` : `1px solid ${semantic.inputBorder}`,
              }}
            />
            {errors.location && (
              <p className="mt-1 text-xs" style={{ ...monoStyle, color: semantic.errorText }}>
                {errors.location}
              </p>
            )}
          </div>

          {/* Activity Type */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Activity Type</p>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_TYPES.map(t => (
                <button
                  key={t.label}
                  onClick={() => setActivityType(t)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    ...monoStyle,
                    backgroundColor: activityType.label === t.label ? semantic.brandActive : semantic.inputBg,
                    border: activityType.label === t.label ? `1px solid ${semantic.brand}` : `1px solid ${semantic.inputBorder}`,
                    color: activityType.label === t.label ? semantic.primaryText : semantic.labelText,
                  }}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feel */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Feel</p>
            <div className="flex gap-2">
              {FEEL_OPTIONS.map(f => {
                const active = feel === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setFeel(f.label)}
                    className="flex-1 py-2 rounded-lg text-sm transition-all"
                    style={{
                      ...monoStyle,
                      backgroundColor: active ? f.activeColor : semantic.inputBg,
                      border: active ? `1px solid ${f.activeBorder}` : `1px solid ${semantic.inputBorder}`,
                      color: active ? f.activeText : semantic.labelText,
                    }}
                  >
                    {f.emoji} {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weather */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Weather</p>
            <div className="flex gap-2">
              <div className="relative" style={{ flex: 1 }}>
                <input
                  type="text"
                  value={temp}
                  onChange={e => setTemp(e.target.value.replace(/[^\d.-]/g, ''))}
                  placeholder="Temp"
                  style={{ ...INPUT_STYLE, paddingRight: '36px' }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ ...monoStyle, fontSize: '13px', color: semantic.labelText }}>°F</span>
              </div>
              <select
                value={skies}
                onChange={e => setSkies(e.target.value)}
                style={{ ...INPUT_STYLE, flex: 1, colorScheme: 'dark', paddingRight: '32px', textAlignLast: 'left', color: skies ? semantic.primaryText : semantic.placeholderText }}
              >
                <option value="" disabled hidden>Skies</option>
                <option value="☀️">☀️ Sunny</option>
                <option value="🌥️">🌥️ Mixed</option>
                <option value="☁️">☁️ Cloudy</option>
                <option value="🌧️">🌧️ Rain</option>
                <option value="❄️">❄️ Snow</option>
              </select>
              <select
                value={wind}
                onChange={e => setWind(e.target.value)}
                style={{ ...INPUT_STYLE, flex: 1, colorScheme: 'dark', paddingLeft: '12px', paddingRight: '32px', textAlignLast: 'left', color: wind ? semantic.primaryText : semantic.placeholderText }}
              >
                <option value="" disabled hidden>Wind</option>
                <option value="No Wind">No Wind</option>
                <option value="Breezy">Breezy</option>
                <option value="Tornado">Tornado</option>
                <option value="❄️">❄️ Snow</option>
              </select>
            </div>
          </div>

          {/* Base Layers */}
          <div>
            <p className="mb-3" style={LABEL_STYLE}>Base Layers</p>
            <ClothingPicker items={baseLayers} selected={selectedBaseLayers} onToggle={toggleBaseLayer} />
          </div>

          {/* Outerwear */}
          <div>
            <p className="mb-3" style={LABEL_STYLE}>Outerwear</p>
            <ClothingPicker items={outerwear} selected={selectedOuterwear} onToggle={toggleOuterwear} />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-lg text-xl transition-opacity"
            style={{
              ...HEADING_STYLE,
              backgroundColor: saving ? semantic.brandSaving : semantic.brand,
              color: semantic.primaryText,
              boxShadow: semantic.brandShadow,
            }}
          >
            {saving ? 'SAVING...' : 'SAVE ACTIVITY'}
          </button>
        </div>
      </div>
    </>
  );
}
