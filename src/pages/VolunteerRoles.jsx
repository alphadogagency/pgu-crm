import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUSES = ['Confirmed', 'Need', 'N/A'];

export default function VolunteerRoles() {
  const { data, update, generateId } = useStopContext();
  const roles = data.volunteerRoles || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ roleName: '', assignedTo: '', contactInfo: '', status: 'Need' }); setEditing('new'); };
  const openEdit = (r) => { setForm({ roleName: r.roleName, assignedTo: r.assignedTo, contactInfo: r.contactInfo, status: r.status }); setEditing(r.id); };

  const save = () => {
    if (editing === 'new') {
      update('volunteerRoles', (prev) => [...prev, { id: generateId(), ...form }]);
    } else {
      update('volunteerRoles', (prev) => prev.map((r) => (r.id === editing ? { ...r, ...form } : r)));
    }
    setEditing(null);
  };

  const remove = (id) => update('volunteerRoles', (prev) => prev.filter((r) => r.id !== id));
  const filled = roles.filter((r) => r.status === 'Confirmed').length;

  const statusBorder = (status) => {
    if (status === 'Confirmed') return 'border-l-4 border-l-green-500';
    if (status === 'Need') return 'border-l-4 border-l-orange-400';
    return 'border-l-4 border-l-gray-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pgu-navy">On-Site Roles</h2>
          <p className="text-sm text-pgu-gray">{filled}/{roles.length} Roles Filled</p>
        </div>
        <button onClick={openNew} className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer">+ Add Role</button>
      </div>
      <div className="space-y-2">
        {roles.map((role) => (
          <div key={role.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between ${statusBorder(role.status)}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-pgu-navy">{role.roleName}</p>
                <StatusBadge status={role.status} />
              </div>
              {role.assignedTo ? (
                <p className="text-sm text-pgu-gray">{role.assignedTo}{role.contactInfo ? ` — ${role.contactInfo}` : ''}</p>
              ) : (
                <p className="text-sm text-pgu-gray italic">Unassigned</p>
              )}
            </div>
            <div className="space-x-2 shrink-0">
              <button onClick={() => openEdit(role)} className="text-sm text-pgu-gold hover:underline cursor-pointer">Edit</button>
              <button onClick={() => remove(role.id)} className="text-sm text-red-500 hover:underline cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {roles.length === 0 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-pgu-gray">No volunteer roles yet.</div>}
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Role' : 'Edit Role'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Role Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.roleName || ''} onChange={(e) => setForm({ ...form, roleName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Assigned To</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.assignedTo || ''} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Contact Info</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.contactInfo || ''} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.status || 'Need'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
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
