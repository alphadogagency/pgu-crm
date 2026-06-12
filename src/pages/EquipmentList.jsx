import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import { useEquipmentLibrary } from '../hooks/useEquipmentLibrary';

const DEFAULT_ITEMS = [
  'Basketballs', 'Ball Cart / Rack', 'Cones', 'Pinnies / Scrimmage Vests',
  'Scorebook', 'Scoreboard', 'Portable Speaker', 'Whiteboard & Markers',
  'First Aid Kit', 'Ice & Coolers', 'Water Jugs / Cups',
  'Extension Cords / Power Strips', 'Folding Tables',
  'Registration Clipboards & Pens', 'Camp Shirts / Merch',
  'Trophies / Awards', 'Banners / Signage', 'Phone Chargers / Power Banks',
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function EquipmentList() {
  const { data, update } = useStopContext();
  const list = data.equipmentList || [];
  const { library, addToLibrary, error: libraryError } = useEquipmentLibrary();

  const [newItem, setNewItem]         = useState('');
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesValue, setNotesValue]   = useState('');

  const packed = list.filter((i) => i.checked).length;
  const total  = list.length;
  const pct    = total > 0 ? Math.round((packed / total) * 100) : 0;

  // Library items that aren't already in this camp's list
  const currentNames   = list.map((i) => i.item.toLowerCase());
  const libraryOptions = library.filter((name) => !currentNames.includes(name.toLowerCase()));

  // ── Add a new custom item ────────────────────────────────────────────────
  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    update('equipmentList', (prev) => [
      ...prev,
      { id: generateId(), item: trimmed, checked: false, notes: '' },
    ]);
    addToLibrary(trimmed);
    setNewItem('');
  };

  // ── Add an item from the shared library ──────────────────────────────────
  const addFromLibrary = (name) => {
    update('equipmentList', (prev) => [
      ...prev,
      { id: generateId(), item: name, checked: false, notes: '' },
    ]);
  };

  // ── Toggle checked ───────────────────────────────────────────────────────
  const toggle = (id) => {
    update('equipmentList', (prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const removeItem = (id) => {
    update('equipmentList', (prev) => prev.filter((i) => i.id !== id));
  };

  const openNotes = (item) => { setEditingNotes(item.id); setNotesValue(item.notes || ''); };
  const saveNotes = () => {
    update('equipmentList', (prev) =>
      prev.map((i) => (i.id === editingNotes ? { ...i, notes: notesValue } : i))
    );
    setEditingNotes(null);
  };

  const resetToDefault = () => {
    if (!window.confirm('Reset to the default equipment list? Your current list and check-off progress will be cleared.')) return;
    update('equipmentList', DEFAULT_ITEMS.map((item) => ({ id: generateId(), item, checked: false, notes: '' })));
  };

  const uncheckAll = () => {
    update('equipmentList', (prev) => prev.map((i) => ({ ...i, checked: false })));
  };

  // Unchecked first, checked at bottom
  const sorted = [...list].sort((a, b) => Number(a.checked) - Number(b.checked));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pgu-navy">Equipment List</h2>
          <p className="text-sm text-pgu-gray mt-0.5">{packed} of {total} items packed</p>
        </div>
        <div className="flex gap-2">
          <button onClick={uncheckAll} className="text-xs text-pgu-gray border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Uncheck All
          </button>
          <button onClick={resetToDefault} className="text-xs text-pgu-gray border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Reset to Default
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-pgu-navy">{pct}% packed</span>
          <span className="text-pgu-gray">{packed}/{total} items</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-pgu-gold rounded-full h-3 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        {packed === total && total > 0 && (
          <p className="text-green-600 text-sm font-medium mt-2">✅ All packed — you're ready!</p>
        )}
      </div>

      {/* Add new item */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Add a custom item…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button
          onClick={addItem}
          className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>

      {/* Shared library picker */}
      {libraryOptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-3">
            From Your Library — tap to add to this stop
          </p>
          <div className="flex flex-wrap gap-2">
            {libraryOptions.map((name) => (
              <button
                key={name}
                onClick={() => addFromLibrary(name)}
                className="flex items-center gap-1 bg-pgu-gold/10 hover:bg-pgu-gold/20 border border-pgu-gold/30 hover:border-pgu-gold/60 text-pgu-navy text-xs font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <span className="text-pgu-gold">+</span> {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {libraryError && (
        <p className="text-xs text-red-600">
          Equipment library could not sync: {libraryError}
        </p>
      )}

      {/* Item list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
        {sorted.length === 0 && (
          <p className="px-4 py-8 text-center text-pgu-gray text-sm">No items yet. Add one above.</p>
        )}
        {sorted.map((item) => (
          <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${item.checked ? 'bg-gray-50' : ''}`}>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggle(item.id)}
              className="w-4 h-4 accent-pgu-gold cursor-pointer shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium ${item.checked ? 'line-through text-gray-400' : 'text-pgu-navy'}`}>
                {item.item}
              </span>
              {item.notes && (
                <p className="text-xs text-pgu-gray mt-0.5 truncate">{item.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {editingNotes === item.id ? (
                <input
                  autoFocus
                  className="border border-gray-300 rounded px-2 py-1 text-xs w-40"
                  placeholder="Add note…"
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveNotes()}
                  onBlur={saveNotes}
                />
              ) : (
                <button onClick={() => openNotes(item)} className="text-xs text-gray-400 hover:text-pgu-gold transition-colors cursor-pointer">
                  {item.notes ? '✏️' : '+ note'}
                </button>
              )}
              <button onClick={() => removeItem(item.id)} className="text-xs text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
