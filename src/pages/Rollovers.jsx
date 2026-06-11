import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import Modal from '../components/Modal';

const STOPS_OPTIONS = ['Goodland', 'Limon', 'Marion', 'South Bend'];

export default function Rollovers() {
  const { data, update, generateId } = useStopContext();
  const rollovers = data.rollovers || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ athleteName: '', contactInfo: '', originalStop: '', notes: '' }); setEditing('new'); };
  const openEdit = (r) => { setForm({ athleteName: r.athleteName, contactInfo: r.contactInfo, originalStop: r.originalStop, notes: r.notes }); setEditing(r.id); };

  const save = () => {
    if (editing === 'new') {
      update('rollovers', (prev) => [...(prev || []), { id: generateId(), ...form, createdAt: new Date().toISOString() }]);
    } else {
      update('rollovers', (prev) => prev.map((r) => (r.id === editing ? { ...r, ...form } : r)));
    }
    setEditing(null);
  };

  const remove = (id) => update('rollovers', (prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pgu-navy">2027 Rollovers</h2>
          <p className="text-sm text-pgu-gray">Athletes rolling their registration to 2027</p>
        </div>
        <button onClick={openNew} className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer">+ Add Athlete</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Athlete Name</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Contact</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Original Stop</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Notes</th>
              <th className="text-right px-4 py-3 font-semibold text-pgu-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rollovers.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-pgu-navy">{entry.athleteName}</td>
                <td className="px-4 py-3 text-pgu-gray">{entry.contactInfo || '—'}</td>
                <td className="px-4 py-3 text-pgu-gray">{entry.originalStop || '—'}</td>
                <td className="px-4 py-3 text-pgu-gray">{entry.notes || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(entry)} className="text-pgu-gold hover:underline cursor-pointer">Edit</button>
                  <button onClick={() => remove(entry.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
            {rollovers.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-pgu-gray">No rollovers yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-pgu-gray">{rollovers.length} athlete{rollovers.length !== 1 ? 's' : ''} rolling over</p>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Rollover' : 'Edit Rollover'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Athlete Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.athleteName || ''} onChange={(e) => setForm({ ...form, athleteName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Contact Info</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Phone or email" value={form.contactInfo || ''} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Original Stop</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.originalStop || ''} onChange={(e) => setForm({ ...form, originalStop: e.target.value })}>
              <option value="">Select...</option>
              {STOPS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Notes</label><textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="flex-1 bg-pgu-gold text-white py-2 rounded-lg font-medium hover:bg-pgu-gold-light cursor-pointer">Save</button>
            <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-pgu-navy py-2 rounded-lg font-medium hover:bg-gray-200 cursor-pointer">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
