import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';

export default function RegistrationTracker() {
  const { data, update, stop } = useStopContext();

  const reg = data.registration || { capacity: 0, registered: 0, waitlist: 0, notes: '' };
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const { capacity, registered, waitlist, notes } = reg;
  const pct = capacity > 0 ? Math.min(100, Math.round((registered / capacity) * 100)) : 0;
  const spotsLeft = Math.max(0, capacity - registered);
  const isFull = capacity > 0 && registered >= capacity;

  const openEdit = () => {
    setForm({ capacity, registered, waitlist, notes });
    setEditing(true);
  };

  const save = () => {
    update('registration', {
      capacity:   Number(form.capacity)   || 0,
      registered: Number(form.registered) || 0,
      waitlist:   Number(form.waitlist)   || 0,
      notes:      form.notes || '',
    });
    setEditing(false);
  };

  const field = (key, label, placeholder = '0') => (
    <div>
      <label className="block text-sm font-medium text-pgu-gray mb-1">{label}</label>
      <input
        type="number"
        min="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        placeholder={placeholder}
        value={form[key] ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pgu-navy">Registration Tracker</h2>
          <p className="text-sm text-pgu-gray mt-0.5">{stop.label} · {stop.dates}</p>
        </div>
        <button
          onClick={openEdit}
          className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer"
        >
          {capacity === 0 ? 'Set Up' : 'Update Numbers'}
        </button>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-1">Registered</p>
          <p className="text-4xl font-bold text-pgu-navy">{registered}</p>
          {capacity > 0 && <p className="text-sm text-pgu-gray mt-1">of {capacity} capacity</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-1">Spots Left</p>
          <p className={`text-4xl font-bold ${isFull ? 'text-red-500' : 'text-green-600'}`}>
            {capacity === 0 ? '—' : spotsLeft}
          </p>
          {isFull && <p className="text-sm text-red-500 font-medium mt-1">Camp Full</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-1">Waitlist</p>
          <p className={`text-4xl font-bold ${waitlist > 0 ? 'text-pgu-gold' : 'text-pgu-navy'}`}>
            {waitlist}
          </p>
          {waitlist > 0 && <p className="text-sm text-pgu-gray mt-1">campers waiting</p>}
        </div>
      </div>

      {/* Progress bar */}
      {capacity > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-pgu-navy">{pct}% full</span>
            <span className="text-pgu-gray">{registered} / {capacity} campers</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`rounded-full h-4 transition-all duration-500 ${isFull ? 'bg-red-500' : pct >= 80 ? 'bg-pgu-gold' : 'bg-green-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-pgu-gray mt-2">
            <span>0</span>
            <span className={pct >= 80 && !isFull ? 'text-pgu-gold font-medium' : ''}>
              {pct >= 80 && !isFull ? '⚠ Filling fast' : ''}
            </span>
            <span>{capacity}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-2">Notes</h3>
          <p className="text-sm text-pgu-navy whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* Active.com link + API note */}
      <div className="bg-pgu-navy/5 border border-pgu-navy/10 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔗</span>
          <div>
            <p className="font-semibold text-pgu-navy text-sm">Active.com Registration</p>
            <p className="text-pgu-gray text-sm mt-1">
              View live registration data directly on your Active.com dashboard.
              Once your backend is connected, registration numbers can sync here automatically.
            </p>
            <a
              href="https://camps.active.com/pointguardu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-pgu-gold hover:text-pgu-gold-light font-medium text-sm transition-colors"
            >
              Open Active.com Dashboard ↗
            </a>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-pgu-navy mb-4">Update Registration Numbers</h3>
            <div className="space-y-4">
              {field('capacity',   'Camp Capacity')}
              {field('registered', 'Registered')}
              {field('waitlist',   'Waitlist')}
              <div>
                <label className="block text-sm font-medium text-pgu-gray mb-1">Notes</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Any registration notes…"
                  value={form.notes || ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="flex-1 bg-pgu-gold text-white py-2 rounded-lg font-medium hover:bg-pgu-gold-light cursor-pointer">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-pgu-navy py-2 rounded-lg font-medium hover:bg-gray-200 cursor-pointer">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
