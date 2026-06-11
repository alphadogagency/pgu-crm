import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import Modal from '../components/Modal';

export default function KeyPersonnel() {
  const { data, update, generateId } = useStopContext();
  const personnel = data.keyPersonnel || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ name: '', contactInfo: '', role: 'Key Personnel', notes: '' }); setEditing('new'); };
  const openEdit = (p) => { setForm({ name: p.name, contactInfo: p.contactInfo, role: p.role, notes: p.notes }); setEditing(p.id); };

  const save = () => {
    if (editing === 'new') {
      update('keyPersonnel', (prev) => [...prev, { id: generateId(), ...form }]);
    } else {
      update('keyPersonnel', (prev) => prev.map((p) => (p.id === editing ? { ...p, ...form } : p)));
    }
    setEditing(null);
  };

  const remove = (id) => update('keyPersonnel', (prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pgu-navy">Key Personnel</h2>
        <button onClick={openNew} className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer">+ Add Person</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Contact</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Notes</th>
              <th className="text-right px-4 py-3 font-semibold text-pgu-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((person) => (
              <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-pgu-navy">{person.name}</td>
                <td className="px-4 py-3 text-pgu-gray">{person.contactInfo}</td>
                <td className="px-4 py-3 text-pgu-gray">{person.role}</td>
                <td className="px-4 py-3 text-pgu-gray">{person.notes || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(person)} className="text-pgu-gold hover:underline cursor-pointer">Edit</button>
                  <button onClick={() => remove(person.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
            {personnel.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-pgu-gray">No personnel added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Person' : 'Edit Person'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Contact Info</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.contactInfo || ''} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Role</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
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
