import { useState, useEffect, useRef } from 'react';
import { fetchActivities, fetchClothing } from './lib/api';
import { semantic, fonts, monoStyle } from './lib/theme';
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
  const headerRef = useRef(null);
  const firstCardRef = useRef(null);

  useEffect(() => {
    const anyOpen = clothingOpen || logOpen || filterOpen || !!editActivity;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [clothingOpen, logOpen, filterOpen, editActivity]);

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
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#000000' }}>
      <div ref={headerRef} className="sticky top-0 z-0 px-4 pt-8 pb-2" style={{ opacity: headerOpacity, transition: 'opacity 0.05s linear' }}>
        <h1
          className="text-[60px] leading-none text-center tracking-wide"
          style={{ fontFamily: fonts.heading, color: semantic.brand }}
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
              className="text-xs font-medium mb-2 px-1 mx-auto w-full"
              style={{ ...monoStyle, color: semantic.primaryText, opacity: 0.8, maxWidth: '600px' }}
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
    </div>
  );
}
