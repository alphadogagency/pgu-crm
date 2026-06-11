import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUSES = ['Confirmed', 'Need', 'N/A'];
const TYPES = ['Food', 'Lodging', 'Cash'];
const LEVELS = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Community'];

export default function Sponsors() {
  const { data, update, generateId } = useStopContext();
  const sponsors = data.sponsors || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ sponsorType: 'Food', sponsorName: '', contactInfo: '', level: '', status: 'Need', notes: '' }); setEditing('new'); };
  const openEdit = (s) => { setForm({ sponsorType: s.sponsorType, sponsorName: s.sponsorName, contactInfo: s.contactInfo, level: s.level, status: s.status, notes: s.notes }); setEditing(s.id); };

  const save = () => {
    if (editing === 'new') {
      update('sponsors', (prev) => [...prev, { id: generateId(), ...form }]);
    } else {
      update('sponsors', (prev) => prev.map((s) => (s.id === editing ? { ...s, ...form } : s)));
    }
    setEditing(null);
  };

  const remove = (id) => update('sponsors', (prev) => prev.filter((s) => s.id !== id));

  const grouped = TYPES.map((type) => ({ type, items: sponsors.filter((s) => s.sponsorType === type) }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pgu-navy">Sponsors</h2>
        <button onClick={openNew} className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer">+ Add Sponsor</button>
      </div>

      <GymFeeCard gymFee={data.gymFee} update={update} />

      <div className="space-y-4">
        {grouped.map(({ type, items }) => (
          <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-pgu-navy text-white px-4 py-3 font-semibold">{type} Sponsors</div>
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-pgu-gray text-sm">No {type.toLowerCase()} sponsors yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((sponsor) => (
                  <div key={sponsor.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-pgu-navy">{sponsor.sponsorName || <span className="italic text-pgu-gray">Unfilled</span>}</p>
                        <StatusBadge status={sponsor.status} />
                        {sponsor.level && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">{sponsor.level}</span>}
                      </div>
                      {sponsor.contactInfo && <p className="text-sm text-pgu-gray">{sponsor.contactInfo}</p>}
                      {sponsor.notes && <p className="text-sm text-pgu-gray italic">{sponsor.notes}</p>}
                    </div>
                    <div className="space-x-2 shrink-0 ml-4">
                      <button onClick={() => openEdit(sponsor)} className="text-sm text-pgu-gold hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => remove(sponsor.id)} className="text-sm text-red-500 hover:underline cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Sponsor' : 'Edit Sponsor'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.sponsorType || 'Food'} onChange={(e) => setForm({ ...form, sponsorType: e.target.value })}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Sponsor Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.sponsorName || ''} onChange={(e) => setForm({ ...form, sponsorName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Contact Info</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.contactInfo || ''} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.status || 'Need'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {form.status === 'Confirmed' && (
            <div><label className="block text-sm font-medium text-pgu-gray mb-1">Level</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.level || ''} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option value="">Select level...</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}
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

function GymFeeCard({ gymFee, update }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const fee = gymFee || { status: 'Need', amount: '', notes: '' };

  const openEdit = () => { setForm({ status: fee.status, amount: fee.amount, notes: fee.notes }); setEditing(true); };
  const save = () => { update('gymFee', form); setEditing(false); };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-pgu-navy">Gym Fee</h3>
          <StatusBadge status={fee.status} />
          {fee.amount && <span className="text-sm font-medium text-pgu-navy">{fee.amount}</span>}
          {fee.notes && <span className="text-sm text-pgu-gray italic">{fee.notes}</span>}
        </div>
        <button onClick={openEdit} className="text-sm text-pgu-gold hover:underline cursor-pointer">Edit</button>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Gym Fee">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.status || 'Need'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['Confirmed', 'Need', 'N/A'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Amount</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g., FREE, $200" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-pgu-gray mb-1">Notes</label><textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="flex-1 bg-pgu-gold text-white py-2 rounded-lg font-medium hover:bg-pgu-gold-light cursor-pointer">Save</button>
            <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-pgu-navy py-2 rounded-lg font-medium hover:bg-gray-200 cursor-pointer">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
