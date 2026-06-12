import { useState, useMemo } from 'react';
import { useStopContext } from '../context/StopDataContext';
import Modal from '../components/Modal';

const ROLES = ['All', 'Coach', 'Key Personnel', 'Sponsor', 'On-Site', 'Other'];

export default function Contacts() {
  const { data, update, generateId } = useStopContext();
  const contacts = useMemo(() => data.contacts || [], [data.contacts]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = useMemo(() => contacts.filter((c) => {
    const matchesRole = roleFilter === 'All' || c.role === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch = !search || c.name.toLowerCase().includes(q) || c.contactInfo.toLowerCase().includes(q) || (c.organization || '').toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  }), [contacts, search, roleFilter]);

  const openNew = () => { setForm({ name: '', contactInfo: '', role: 'Other', organization: '', notes: '' }); setEditing('new'); };
  const openEdit = (c) => { setForm({ name: c.name, contactInfo: c.contactInfo, role: c.role, organization: c.organization, notes: c.notes }); setEditing(c.id); };

  const save = () => {
    if (editing === 'new') {
      update('contacts', (prev) => [...prev, { id: generateId(), ...form }]);
    } else {
      update('contacts', (prev) => prev.map((c) => (c.id === editing ? { ...c, ...form } : c)));
    }
    setEditing(null);
  };

  const remove = (id) => update('contacts', (prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pgu-navy">Contacts</h2>
        <button onClick={openNew} className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer">+ Add Contact</button>
      </div>
      <div className="flex gap-3">
        <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Search by name, contact, or org..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Contact</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray hidden md:table-cell">Organization</th>
              <th className="text-left px-4 py-3 font-semibold text-pgu-gray hidden lg:table-cell">Notes</th>
              <th className="text-right px-4 py-3 font-semibold text-pgu-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-pgu-navy">{contact.name}</td>
                <td className="px-4 py-3 text-pgu-gray">{contact.contactInfo}</td>
                <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-pgu-gray px-2 py-0.5 rounded font-medium">{contact.role}</span></td>
                <td className="px-4 py-3 text-pgu-gray hidden md:table-cell">{contact.organization || '—'}</td>
                <td className="px-4 py-3 text-pgu-gray hidden lg:table-cell">{contact.notes || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(contact)} className="text-pgu-gold hover:underline cursor-pointer">Edit</button>
                  <button onClick={() => remove(contact.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-pgu-gray">No contacts found.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-pgu-gray">{filtered.length} of {contacts.length} contacts shown</p>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Contact' : 'Edit Contact'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Contact Info</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.contactInfo || ''} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Role</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.role || 'Other'} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.filter((r) => r !== 'All').map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Organization</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.organization || ''} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
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
