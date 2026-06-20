import { useState, useEffect, useRef } from 'react';
import { PlusIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { fetchClothing, createClothingItem, updateClothingItem, deleteClothingItem, uploadImage } from '../lib/api';
import { semantic, fonts, monoStyle, headingStyle as HEADING_STYLE } from '../lib/theme';

const TABS = ['Base Layers', 'Outerwear'];

function AddPanel({ defaultCategory, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col pt-8"
      style={{ backgroundColor: semantic.overlay, borderRadius: '12px 12px 0 0' }}
    >
      {/* Name input */}
      <div className="px-5 pb-5">
        <label className="block text-xs mb-2" style={{ ...monoStyle, color: semantic.labelText }}>
          NAME
        </label>
        <input
          type="text"
          value={name}
          placeholder="e.g. Rain Jacket"
          className="w-full px-4 py-3 rounded-lg outline-none text-base"
          style={{
            ...monoStyle,
            backgroundColor: semantic.inputBg,
            border: `1px solid ${nameError ? semantic.error : semantic.inputBorder}`,
            color: semantic.primaryText,
          }}
          onChange={e => { setName(e.target.value); if (e.target.value.trim()) setNameError(false); }}
        />
        {nameError && (
          <p className="mt-2 text-xs" style={{ ...monoStyle, color: semantic.errorText }}>
            Name Required
          </p>
        )}
      </div>

      {/* Category dropdown */}
      <div className="px-5 pb-5">
        <label className="block text-xs mb-2" style={{ ...monoStyle, color: semantic.labelText }}>
          CATEGORY
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-lg outline-none text-base appearance-none"
          style={{
            ...monoStyle,
            backgroundColor: semantic.inputBg,
            border: `1px solid ${semantic.inputBorder}`,
            color: semantic.primaryText,
          }}
        >
          <option value="Base Layer" style={{ backgroundColor: semantic.overlay }}>Base Layer</option>
          <option value="Outerwear" style={{ backgroundColor: semantic.overlay }}>Outerwear</option>
        </select>
      </div>

      {/* Photo */}
      <div className="flex justify-center px-5 pb-5">
        <button
          className="relative w-40 h-40 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ border: `1px dashed ${semantic.drawerHandle}`, backgroundColor: semantic.photoUploadBg }}
          onClick={() => fileRef.current.click()}
        >
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: semantic.modalOverlay }}>
                <Pencil1Icon width={20} height={20} color={semantic.primaryText} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <PlusIcon width={24} height={24} color={semantic.brand} />
              <span className="text-xs" style={{ ...monoStyle, color: semantic.labelText }}>Add Photo</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </button>
      </div>

      {/* Buttons */}
      <div className="px-5 flex flex-col gap-3">
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
          style={{
            ...HEADING_STYLE,
            backgroundColor: semantic.inputBg,
            border: `1px solid ${semantic.inputBorder}`,
            color: semantic.labelText,
          }}
        >
          CANCEL
        </button>
        <button
          onClick={async () => {
            if (!name.trim()) { setNameError(true); return; }
            setSaving(true);
            try {
              let finalImageUrl = imageUrl;
              if (imageUrl?.startsWith('data:')) {
                const { url } = await uploadImage(imageUrl, `${name.trim()}-${Date.now()}`);
                finalImageUrl = url;
              }
              await onSave({ category, name: name.trim(), imageUrl: finalImageUrl });
            } catch (err) {
              console.error(err);
              alert('Failed to save. Please try again.');
            } finally {
              setSaving(false);
            }
          }}
          className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
          style={{
            ...HEADING_STYLE,
            backgroundColor: saving ? semantic.brandSaving : semantic.brand,
            color: semantic.primaryText,
            boxShadow: semantic.brandShadow,
          }}
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </div>
  );
}

function EditPanel({ item, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(item.name);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col pt-8"
      style={{ backgroundColor: semantic.overlay, borderRadius: '12px 12px 0 0' }}
    >
      {/* Name input */}
      <div className="px-5 pb-5">
        <label className="block text-xs mb-2" style={{ ...monoStyle, color: semantic.labelText }}>
          NAME
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg outline-none text-base"
          style={{
            ...monoStyle,
            backgroundColor: semantic.inputBg,
            border: `1px solid ${semantic.inputBorder}`,
            color: semantic.primaryText,
          }}
        />
      </div>

      {/* Photo */}
      <div className="flex justify-center px-5 pb-5">
        <button
          className="relative w-40 h-40 rounded-xl overflow-hidden"
          style={{ border: `1px solid ${semantic.inputBorder}` }}
          onClick={() => fileRef.current.click()}
        >
          <img
            src={imageUrl ? (imageUrl.startsWith('data:') ? imageUrl : `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`) : ''}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1"
            style={{ backgroundColor: semantic.backdrop }}
          >
            <Pencil1Icon width={20} height={20} color={semantic.primaryText} />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </button>
      </div>

      {/* Buttons */}
      <div className="px-5 flex flex-col gap-3">
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
          style={{
            ...HEADING_STYLE,
            backgroundColor: semantic.inputBg,
            border: `1px solid ${semantic.inputBorder}`,
            color: semantic.labelText,
          }}
        >
          CANCEL
        </button>
        <button
          onClick={() => onDelete(item)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-opacity hover:opacity-80"
          style={{
            ...HEADING_STYLE,
            backgroundColor: semantic.error,
            color: semantic.primaryText,
          }}
        >
          DELETE
        </button>
        <button
          onClick={async () => {
            setSaving(true);
            try {
              let finalImageUrl = imageUrl;
              if (imageUrl?.startsWith('data:')) {
                const { url } = await uploadImage(imageUrl, `${name.trim()}-${Date.now()}`);
                finalImageUrl = url;
              }
              await onSave({ ...item, name, imageUrl: finalImageUrl });
            } catch (err) {
              console.error(err);
              alert('Failed to save. Please try again.');
            } finally {
              setSaving(false);
            }
          }}
          className="w-full py-3 rounded-lg text-xl transition-opacity hover:opacity-80"
          style={{
            ...HEADING_STYLE,
            backgroundColor: saving ? semantic.brandSaving : semantic.brand,
            color: semantic.primaryText,
            boxShadow: semantic.brandShadow,
          }}
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </div>
  );
}

export default function ClothingDrawer({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('Base Layers');
  const [catalog, setCatalog] = useState({ baseLayers: [], outerwear: [] });
  const [editingItem, setEditingItem] = useState(null);
  const [adding, setAdding] = useState(false);
  const dragStartY = useRef(null);

  useEffect(() => {
    if (!open) return;
    fetchClothing().then(items => {
      setCatalog({
        baseLayers: items.filter(i => i.category === 'Base Layer'),
        outerwear: items.filter(i => i.category === 'Outerwear'),
      });
    }).catch(console.error);
  }, [open]);

  function handleTouchStart(e) {
    dragStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (dragStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta > 60) onClose();
    dragStartY.current = null;
  }

  async function handleAdd(newItem) {
    try {
      const saved = await createClothingItem(newItem);
      setCatalog(prev => {
        const key = saved.category === 'Base Layer' ? 'baseLayers' : 'outerwear';
        return { ...prev, [key]: [...prev[key], saved] };
      });
      setAdding(false);
      if (saved.category !== (activeTab === 'Base Layers' ? 'Base Layer' : 'Outerwear')) {
        setActiveTab(saved.category === 'Base Layer' ? 'Base Layers' : 'Outerwear');
      }
    } catch (err) {
      console.error('Failed to save clothing item:', err);
      alert('Failed to save. Please try again.');
    }
  }

  async function handleSave(updated) {
    await updateClothingItem(updated.id, { category: updated.category, name: updated.name, imageUrl: updated.imageUrl });
    setCatalog(prev => {
      const key = prev.baseLayers.find(i => i.id === updated.id) ? 'baseLayers' : 'outerwear';
      return { ...prev, [key]: prev[key].map(i => i.id === updated.id ? updated : i) };
    });
    setEditingItem(null);
  }

  async function handleDelete(item) {
    await deleteClothingItem(item.id);
    setCatalog(prev => ({
      baseLayers: prev.baseLayers.filter(i => i.id !== item.id),
      outerwear: prev.outerwear.filter(i => i.id !== item.id),
    }));
    setEditingItem(null);
  }

  const items = activeTab === 'Base Layers' ? catalog.baseLayers : catalog.outerwear;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: semantic.backdrop,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed left-0 right-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-out overflow-hidden"
        style={{
          height: '80vh',
          backgroundColor: semantic.overlay,
          borderRadius: '12px 12px 0 0',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          borderTop: `1px solid ${semantic.divider}`,
        }}
      >
        {/* Drag handle */}
        <div
          className="shrink-0 flex justify-center pt-3 pb-1 cursor-grab"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: semantic.drawerHandle }} />
        </div>

        {/* Tabs */}
        <div className="shrink-0 pt-6 pb-2 flex justify-center">
          <div
            className="relative inline-flex rounded-full p-1"
            style={{ border: `1px solid ${semantic.brand}` }}
          >
            <div
              className="absolute top-1 bottom-1 rounded-full"
              style={{
                backgroundColor: semantic.brand,
                width: 'calc(50% - 4px)',
                left: activeTab === 'Base Layers' ? '4px' : 'calc(50%)',
                transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative py-2 px-6 rounded-full text-base whitespace-nowrap"
                style={{
                  fontFamily: fonts.heading,
                  letterSpacing: '0.04em',
                  color: activeTab === tab ? semantic.primaryText : semantic.brand60,
                  transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-24">
          <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
              <button
                key={item.id}
                className="flex flex-col items-center gap-2 text-left"
                onClick={() => setEditingItem(item)}
              >
                <span className="text-sm font-medium text-center" style={{ ...monoStyle, color: semantic.primaryText }}>
                  {item.name}
                </span>
                <div
                  className="w-full aspect-square rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${semantic.divider}` }}
                >
                  <img
                    src={item.imageUrl ? `/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}` : ''}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Clothing button */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 pt-4">
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-sm text-xl transition-opacity hover:opacity-80"
            style={{
              ...HEADING_STYLE,
              backgroundColor: semantic.brand,
              color: semantic.primaryText,
              boxShadow: semantic.brandShadow,
            }}
          >
            <PlusIcon width={16} height={16} />
            ADD CLOTHING
          </button>
        </div>

        {/* Add panel */}
        <div
          className="absolute inset-0 z-20 transition-opacity duration-200"
          style={{ opacity: adding ? 1 : 0, pointerEvents: adding ? 'auto' : 'none' }}
        >
          {adding && (
            <AddPanel
              defaultCategory={activeTab === 'Base Layers' ? 'Base Layer' : 'Outerwear'}
              onSave={handleAdd}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>

        {/* Edit panel */}
        <div
          className="absolute inset-0 z-20 transition-transform duration-300 ease-out"
          style={{ transform: editingItem ? 'translateY(0)' : 'translateY(100%)' }}
        >
          {editingItem && (
            <EditPanel
              item={editingItem}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={() => setEditingItem(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
