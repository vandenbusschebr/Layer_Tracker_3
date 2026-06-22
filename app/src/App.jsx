import { useState, useEffect, useRef } from 'react';
import { fetchActivities, fetchClothing } from './lib/api';
import { useTheme } from './lib/ThemeContext';
import ActivityCard from './components/ActivityCard';
import Toolbar from './components/Toolbar';
import ClothingDrawer from './components/ClothingDrawer';
import LogActivityDrawer from './components/LogActivityDrawer';
import FilterDrawer from './components/FilterDrawer';
import EditActivityDrawer from './components/EditActivityDrawer';

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function App() {
  const { semantic, fonts, themeName, applyTheme, themeOptions } = useTheme();
  const monoStyle = { fontFamily: fonts.mono, fontWeight: 800 };

  const [activities, setActivities] = useState([]);
  const [clothingCatalog, setClothingCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clothingOpen, setClothingOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ sort: 'date-desc', types: [], feels: [], tempRange: [-32, 120] });
  const [editActivity, setEditActivity] = useState(null);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [themeSwitcherOpen, setThemeSwitcherOpen] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(themeName);
  const headerRef = useRef(null);
  const firstCardRef = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    const anyOpen = clothingOpen || logOpen || filterOpen || !!editActivity || themeSwitcherOpen;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [clothingOpen, logOpen, filterOpen, editActivity, themeSwitcherOpen]);

  useEffect(() => {
    function handleScroll() {
      if (!headerRef.current) return;
      const headerH = headerRef.current.offsetHeight;
      const scrollY = window.scrollY;
      if (scrollY <= 0) { setHeaderOpacity(1); return; }
      const fadeEnd = headerH * 0.5;
      const opacity = 1 - Math.min(1, scrollY / fadeEnd);
      setHeaderOpacity(opacity);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    Promise.all([fetchActivities(), fetchClothing()])
      .then(([activityData, clothingData]) => {
        setActivities(activityData.sort((a, b) => b.date.localeCompare(a.date)));
        setClothingCatalog(clothingData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleTitlePressStart() {
    longPressTimer.current = setTimeout(() => {
      setPendingTheme(themeName);
      setThemeSwitcherOpen(true);
    }, 3000);
  }

  function handleTitlePressEnd() {
    clearTimeout(longPressTimer.current);
  }

  function handleThemeSave() {
    applyTheme(pendingTheme);
    setThemeSwitcherOpen(false);
  }

  const [tempMin, tempMax] = filters.tempRange;
  const visibleActivities = activities
    .filter(a => filters.types.length === 0 || filters.types.includes(a.type))
    .filter(a => filters.feels.length === 0 || filters.feels.includes(a.feel))
    .filter(a => {
      const t = parseFloat(a.weather?.temp);
      if (isNaN(t)) return true;
      return t >= tempMin && t <= tempMax;
    })
    .sort((a, b) => {
      if (filters.sort === 'date-asc') return a.date.localeCompare(b.date);
      if (filters.sort === 'location') return a.location.localeCompare(b.location);
      return b.date.localeCompare(a.date);
    });

  const activeFilterCount = filters.types.length + filters.feels.length +
    (filters.tempRange[0] !== -32 || filters.tempRange[1] !== 120 ? 1 : 0);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: semantic.surface }}>
      <div ref={headerRef} className="sticky top-0 z-0 px-4 pt-8 pb-2" style={{ opacity: headerOpacity, transition: 'opacity 0.05s linear' }}>
        <h1
          className="text-4xl leading-none text-center tracking-wide select-none"
          style={{ fontFamily: fonts.heading, color: semantic.brand }}
          onMouseDown={handleTitlePressStart}
          onMouseUp={handleTitlePressEnd}
          onMouseLeave={handleTitlePressEnd}
          onTouchStart={handleTitlePressStart}
          onTouchEnd={handleTitlePressEnd}
        >
          LAYER TRACKER
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-9">
        {loading && (
          <p className="text-center text-sm" style={{ ...monoStyle, color: semantic.mutedText }}>
            Loading...
          </p>
        )}
        {error && (
          <p className="text-center text-sm" style={{ ...monoStyle, color: semantic.errorText }}>
            Error: {error}
          </p>
        )}
        {visibleActivities.map((activity, index) => (
          <div key={activity.id} ref={index === 0 ? firstCardRef : null}>
            <p
              className="text-xs font-medium mb-2 mx-auto w-full"
              style={{ ...monoStyle, fontWeight: 500, color: semantic.primaryText, opacity: 0.8, maxWidth: '600px', paddingLeft: '24px' }}
            >
              {formatDate(activity.date)}
            </p>
            <div onClick={() => setEditActivity(activity)} className="cursor-pointer">
              <ActivityCard activity={activity} clothingCatalog={clothingCatalog} />
            </div>
          </div>
        ))}
      </div>

      <Toolbar
        onOpenClothing={() => setClothingOpen(true)}
        onOpenLog={() => setLogOpen(true)}
        onOpenFilter={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      <ClothingDrawer open={clothingOpen} onClose={() => setClothingOpen(false)} />
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onChange={setFilters} />
      <EditActivityDrawer
        open={!!editActivity}
        onClose={() => setEditActivity(null)}
        activity={editActivity}
        clothingCatalog={clothingCatalog}
        onSaved={(updated) => {
          setActivities(prev => prev.map(a => String(a.id) === String(updated.id) ? { ...a, ...updated } : a));
          setEditActivity(null);
        }}
        onDeleted={(id) => {
          setActivities(prev => prev.filter(a => String(a.id) !== String(id)));
          setEditActivity(null);
        }}
      />
      <LogActivityDrawer
        open={logOpen}
        onClose={() => setLogOpen(false)}
        clothingCatalog={clothingCatalog}
        onSaved={(newActivity) => {
          setActivities(prev => [newActivity, ...prev]);
        }}
      />

      {/* Theme Switcher Modal */}
      {themeSwitcherOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: semantic.modalOverlay, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={() => setThemeSwitcherOpen(false)}
          />
          <div
            className="fixed inset-x-6 z-50 rounded-2xl p-6 flex flex-col gap-5"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: semantic.overlay,
              border: `1px solid ${semantic.inputBorder}`,
            }}
          >
            <h3 style={{ ...monoStyle, fontSize: '16px', letterSpacing: '0.08em', color: semantic.primaryText }}>
              SELECT THEME
            </h3>
            <div className="flex flex-col gap-3">
              {themeOptions.map(opt => (
                <label
                  key={opt.name}
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ ...monoStyle, fontSize: '14px', color: semantic.primaryText }}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={opt.name}
                    checked={pendingTheme === opt.name}
                    onChange={() => setPendingTheme(opt.name)}
                    style={{ accentColor: semantic.brand, width: '18px', height: '18px' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setThemeSwitcherOpen(false)}
                className="flex-1 py-3 rounded-lg"
                style={{ ...monoStyle, fontSize: '13px', backgroundColor: semantic.inputBg, border: `1px solid ${semantic.inputBorder}`, color: semantic.labelText }}
              >
                CANCEL
              </button>
              <button
                onClick={handleThemeSave}
                className="flex-1 py-3 rounded-lg"
                style={{ ...monoStyle, fontSize: '13px', backgroundColor: semantic.brand, color: semantic.primaryText, boxShadow: semantic.brandShadow }}
              >
                SAVE
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
