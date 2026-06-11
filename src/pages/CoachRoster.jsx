import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import Modal from '../components/Modal';

const SHIRT_SIZES = ['YS', 'YM', 'YL', 'YXL', 'AS', 'AM', 'AL', 'AXL', 'A2XL', 'A3XL'];

export default function CoachRoster() {
  const { data, update, generateId } = useStopContext();
  const roster = data.coachRoster || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => {
    setForm({ name: '', contactInfo: '', shirtSize: '', notes: '' });
    setEditing('new');
  };

  const openEdit = (c) => {
    setForm({ name: c.name, contactInfo: c.contactInfo || '', shirtSize: c.shirtSize || '', notes: c.notes || '' });
    setEditing(c.id);
  };

  const save = () => {
    if (editing === 'new') {
      update('coachRoster', (prev) => [...prev, { id: generateId(), ...form }]);
    } else {
      update('coachRoster', (prev) => prev.map((c) => (c.id === editing ? { ...c, ...form } : c)));
    }
    setEditing(null);
  };

  const remove = (id) => update('coachRoster', (prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pgu-navy">Coach Roster</h2>
        <button
          onClick={openNew}
          className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer"
        >
          + Add Coach
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Cell Number</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Shirt Size</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Notes</th>
              <th className="text-right px-4 py-3 font-semibold text-pgu-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((coach) => (
              <tr key={coach.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-pgu-navy">{coach.name}</td>
                <td className="px-4 py-3 text-pgu-gray">{coach.contactInfo || '—'}</td>
                <td className="px-4 py-3 text-pgu-gray">{coach.shirtSize || '—'}</td>
                <td className="px-4 py-3 text-pgu-gray">{coach.notes || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(coach)} className="text-pgu-gold hover:underline cursor-pointer">Edit</button>
                  <button onClick={() => remove(coach.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
            {roster.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-pgu-gray">No coaches yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Coach' : 'Edit Coach'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Cell Number</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="(000) 000-0000"
              value={form.contactInfo || ''}
              onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Shirt Size</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.shirtSize || ''}
              onChange={(e) => setForm({ ...form, shirtSize: e.target.value })}
            >
              <option value="">Select size…</option>
              {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={3}
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="flex-1 bg-pgu-gold text-white py-2 rounded-lg font-medium hover:bg-pgu-gold-light cursor-pointer">Save</button>
            <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-pgu-navy py-2 rounded-lg font-medium hover:bg-gray-200 cursor-pointer">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
