import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import Modal from '../components/Modal';

const URGENCIES = ['Red', 'Orange', 'Green'];
const urgencyOrder = { Red: 0, Orange: 1, Green: 2 };
const urgencyStyles = {
  Red: { border: 'border-l-red-500', badge: 'bg-red-100 text-red-700' },
  Orange: { border: 'border-l-pgu-gold', badge: 'bg-orange-100 text-orange-700' },
  Green: { border: 'border-l-green-500', badge: 'bg-green-100 text-green-700' },
};

export default function Reminders() {
  const { data, update, generateId } = useStopContext();
  const reminders = data.reminders || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', details: '', urgency: 'Orange' });

  const addNew = () => {
    if (!form.title.trim()) return;
    update('reminders', (prev) => [
      ...prev,
      { id: generateId(), title: form.title, details: form.details, urgency: form.urgency, createdAt: new Date().toISOString(), completed: false },
    ]);
    setForm({ title: '', details: '', urgency: 'Orange' });
  };

  const toggleComplete = (id) => update('reminders', (prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));

  const openEdit = (r) => { setForm({ title: r.title, details: r.details, urgency: r.urgency }); setEditing(r.id); };
  const saveEdit = () => {
    update('reminders', (prev) => prev.map((r) => (r.id === editing ? { ...r, ...form } : r)));
    setEditing(null);
    setForm({ title: '', details: '', urgency: 'Orange' });
  };
  const remove = (id) => update('reminders', (prev) => prev.filter((r) => r.id !== id));

  const active = reminders.filter((r) => !r.completed).sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-pgu-navy">Reminders & Notes</h2>

      {/* Add Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
        <div className="flex gap-3">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addNew()}
          />
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
            {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <button onClick={addNew} className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer shrink-0">Add</button>
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          rows={2}
          placeholder="Details (optional)..."
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
        />
      </div>

      {/* Active */}
      <div className="space-y-2">
        {active.map((r) => {
          const style = urgencyStyles[r.urgency] || urgencyStyles.Green;
          return (
            <div key={r.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${style.border} p-4 flex items-start gap-3`}>
              <input type="checkbox" checked={false} onChange={() => toggleComplete(r.id)} className="mt-1 h-4 w-4 cursor-pointer" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-pgu-navy">{r.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${style.badge}`}>{r.urgency}</span>
                </div>
                {r.details && <p className="text-sm text-pgu-gray">{r.details}</p>}
              </div>
              <div className="space-x-2 shrink-0">
                <button onClick={() => openEdit(r)} className="text-sm text-pgu-gold hover:underline cursor-pointer">Edit</button>
                <button onClick={() => remove(r.id)} className="text-sm text-red-500 hover:underline cursor-pointer">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide">Completed</h3>
          {completed.map((r) => (
            <div key={r.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start gap-3 opacity-60">
              <input type="checkbox" checked onChange={() => toggleComplete(r.id)} className="mt-1 h-4 w-4 cursor-pointer" />
              <div className="flex-1">
                <p className="font-medium text-pgu-gray line-through">{r.title}</p>
                {r.details && <p className="text-sm text-pgu-gray line-through">{r.details}</p>}
              </div>
              <button onClick={() => remove(r.id)} className="text-sm text-red-500 hover:underline cursor-pointer">Delete</button>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => { setEditing(null); setForm({ title: '', details: '', urgency: 'Orange' }); }} title="Edit Reminder">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Title</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Details</label><textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} value={form.details || ''} onChange={(e) => setForm({ ...form, details: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Urgency</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.urgency || 'Orange'} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
              {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={saveEdit} className="flex-1 bg-pgu-gold text-white py-2 rounded-lg font-medium hover:bg-pgu-gold-light cursor-pointer">Save</button>
            <button onClick={() => { setEditing(null); setForm({ title: '', details: '', urgency: 'Orange' }); }} className="flex-1 bg-gray-100 text-pgu-navy py-2 rounded-lg font-medium hover:bg-gray-200 cursor-pointer">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
