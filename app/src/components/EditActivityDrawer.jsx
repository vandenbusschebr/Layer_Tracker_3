import { useState, useEffect, useRef } from 'react';
import { updateActivityItem, deleteActivityItem } from '../lib/api';
import { semantic, monoStyle, labelStyle as LABEL_STYLE, inputStyle as INPUT_STYLE, headingStyle as HEADING_STYLE, feelConfig } from '../lib/theme';
import ClothingPicker from './ClothingPicker';

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
  activeText: semantic.primaryText,
}));


export default function EditActivityDrawer({ open, onClose, activity, clothingCatalog = [], onSaved, onDeleted }) {
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [feel, setFeel] = useState('Stoked');
  const [temp, setTemp] = useState('');
  const [wind, setWind] = useState('');
  const [skies, setSkies] = useState('');
  const [selectedBaseLayers, setSelectedBaseLayers] = useState([]);
  const [selectedOuterwear, setSelectedOuterwear] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const original = useRef(null);


  useEffect(() => {
    if (open && activity) {
      const found = ACTIVITY_TYPES.find(t => t.label === activity.type) ?? ACTIVITY_TYPES[0];
      setActivityType(found);
      setDate(activity.date ?? '');
      setLocation(activity.location ?? '');
      setFeel(activity.feel ?? 'Stoked');
      setTemp(activity.weather?.temp ?? '');
      setWind(activity.weather?.wind ?? '');
      setSkies(activity.weather?.skies ?? '');
      const bl = (activity.baseLayers ?? []).map(x => typeof x === 'string' ? x : x.id).filter(Boolean);
      const ow = (activity.outerwear ?? []).map(x => typeof x === 'string' ? x : x.id).filter(Boolean);
      setSelectedBaseLayers(bl);
      setSelectedOuterwear(ow);
      setSaving(false);
      setDeleting(false);
      setErrors({});
      setShowDiscardConfirm(false);
      original.current = {
        type: found.label, date: activity.date ?? '', location: activity.location ?? '',
        feel: activity.feel ?? 'Stoked', temp: activity.weather?.temp ?? '',
        wind: activity.weather?.wind ?? '', skies: activity.weather?.skies ?? '',
        baseLayers: bl.join(','), outerwear: ow.join(','),
      };
    }
  }, [open, activity]);

  function isDirty() {
    if (!original.current) return false;
    const o = original.current;
    return (
      activityType.label !== o.type ||
      date !== o.date ||
      location !== o.location ||
      feel !== o.feel ||
      temp !== o.temp ||
      wind !== o.wind ||
      skies !== o.skies ||
      selectedBaseLayers.join(',') !== o.baseLayers ||
      selectedOuterwear.join(',') !== o.outerwear
    );
  }

  function handleClose() {
    if (isDirty()) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
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
      const updated = await updateActivityItem(activity.id, {
        date,
        type: activityType.label,
        typeEmoji: activityType.emoji,
        location: location.trim(),
        feel,
        weather: { temp: temp.trim(), wind: wind.trim(), skies: skies.trim() },
        baseLayers: selectedBaseLayers,
        outerwear: selectedOuterwear,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteActivityItem(activity.id);
      onDeleted(activity.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  const baseLayers = clothingCatalog.filter(i => i.category === 'Base Layer');
  const outerwear = clothingCatalog.filter(i => i.category === 'Outerwear');

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundColor: semantic.drawerBg,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          touchAction: 'pan-y',
          overflowX: 'hidden',
        }}
      >
        {/* Title row with close button */}
        <div className="px-5 pt-12 pb-4 shrink-0 flex items-center justify-between">
          <h2 className="text-3xl" style={{ ...HEADING_STYLE, color: semantic.primaryText }}>EDIT ACTIVITY</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
            style={{ backgroundColor: semantic.inputBg, border: `1px solid ${semantic.inputBorder}` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke={semantic.brand} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
        <div className="px-5 space-y-6 mx-auto w-full" style={{ maxWidth: '600px' }}>

          {/* Date */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Date</p>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ ...INPUT_STYLE, colorScheme: 'dark' }} />
          </div>

          {/* Location */}
          <div>
            <p className="mb-2" style={LABEL_STYLE}>Location</p>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Bear Peak"
              style={{ ...INPUT_STYLE, border: errors.location ? `1px solid ${semantic.error}` : `1px solid ${semantic.inputBorder}` }} />
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
                <button key={t.label} onClick={() => setActivityType(t)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    ...monoStyle,
                    backgroundColor: activityType.label === t.label ? semantic.brandActive : semantic.inputBg,
                    border: activityType.label === t.label ? `1px solid ${semantic.brand}` : `1px solid ${semantic.inputBorder}`,
                    color: activityType.label === t.label ? semantic.primaryText : semantic.labelText,
                  }}>
                  <span>{t.emoji}</span><span>{t.label}</span>
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
                  <button key={f.label} onClick={() => setFeel(f.label)}
                    className="flex-1 py-2 rounded-lg text-sm transition-all"
                    style={{
                      ...monoStyle,
                      backgroundColor: active ? f.activeColor : semantic.inputBg,
                      border: active ? `1px solid ${f.activeBorder}` : `1px solid ${semantic.inputBorder}`,
                      color: active ? f.activeText : semantic.labelText,
                    }}>
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
                <input type="text" value={temp} onChange={e => setTemp(e.target.value.replace(/[^\d.-]/g, ''))}
                  placeholder="Temp" style={{ ...INPUT_STYLE, paddingRight: '36px' }} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ ...monoStyle, fontSize: '13px', color: semantic.labelText }}>°F</span>
              </div>
              <select value={skies} onChange={e => setSkies(e.target.value)}
                style={{ ...INPUT_STYLE, flex: 1, colorScheme: 'dark', paddingRight: '32px', textAlignLast: 'left', color: skies ? semantic.primaryText : semantic.placeholderText }}>
                <option value="" disabled hidden>Skies</option>
                <option value="☀️">☀️ Sunny</option>
                <option value="🌥️">🌥️ Mixed</option>
                <option value="☁️">☁️ Cloudy</option>
                <option value="🌧️">🌧️ Rain</option>
                <option value="❄️">❄️ Snow</option>
              </select>
              <select value={wind} onChange={e => setWind(e.target.value)}
                style={{ ...INPUT_STYLE, flex: 1, colorScheme: 'dark', paddingLeft: '12px', paddingRight: '32px', textAlignLast: 'left', color: wind ? semantic.primaryText : semantic.placeholderText }}>
                <option value="" disabled hidden>Wind</option>
                <option value="No Wind">No Wind</option>
                <option value="Breezy">Breezy</option>
                <option value="Tornado">Tornado</option>
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

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pb-8 items-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
              style={{
                ...HEADING_STYLE,
                maxWidth: '250px',
                backgroundColor: saving ? semantic.brandSaving : semantic.brand,
                color: semantic.primaryText,
                boxShadow: semantic.brandShadow,
              }}
            >
              {saving ? 'SAVING...' : 'SAVE'}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
              style={{
                ...HEADING_STYLE,
                maxWidth: '250px',
                backgroundColor: 'transparent',
                border: `1px solid ${semantic.errorText}`,
                color: semantic.errorText,
              }}
            >
              {deleting ? 'DELETING...' : 'DELETE'}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Discard confirmation */}
      {showDiscardConfirm && (
        <>
          <div className="fixed inset-0" style={{ zIndex: 60, backgroundColor: semantic.modalOverlay }} />
          <div
            className="fixed inset-x-5 rounded-2xl p-6 flex flex-col gap-4"
            style={{
              zIndex: 61,
              backgroundColor: semantic.overlay,
              top: '50%',
              transform: 'translateY(-50%)',
              border: `1px solid ${semantic.inputBorder}`,
            }}
          >
            <h3 className="text-xl" style={{ ...HEADING_STYLE, color: semantic.primaryText }}>
              DISCARD CHANGES?
            </h3>
            <p style={{ ...monoStyle, fontSize: '13px', color: semantic.labelText }}>
              Your changes won't be saved.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => { setShowDiscardConfirm(false); onClose(); }}
                className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
                style={{ ...HEADING_STYLE, backgroundColor: semantic.error, color: semantic.primaryText }}
              >
                DISCARD
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
                style={{ ...HEADING_STYLE, backgroundColor: semantic.inputBg, border: `1px solid ${semantic.inputBorder}`, color: semantic.labelText }}
              >
                KEEP EDITING
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
