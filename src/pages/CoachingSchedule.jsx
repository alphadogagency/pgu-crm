import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import { DAYS } from '../data/stops';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUSES = ['Confirmed', 'Need', 'N/A'];

export default function CoachingSchedule() {
  const { data, update, generateId, stop } = useStopContext();
  const schedule = data.coachingSchedule || [];
  const roster = data.coachRoster || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openEdit = (slot) => {
    setForm({ coachName: slot.coachName, contactInfo: slot.contactInfo, status: slot.status });
    setEditing(slot.id);
  };

  const save = () => {
    update('coachingSchedule', (prev) =>
      prev.map((s) => (s.id === editing ? { ...s, ...form } : s))
    );
    setEditing(null);
  };

  // Rebuild the coaching schedule from the stop's slotsPerDay config.
  // Only touches coachingSchedule — all other stop data is untouched.
  const resetSchedule = () => {
    if (!window.confirm(
      'Reset the coaching schedule? This will clear all slot assignments and rebuild with the correct slot counts for this stop. All other stop data (sponsors, roster, etc.) will not be affected.'
    )) return;
    const { slotsPerDay } = stop;
    const newSchedule = [];
    for (const day of DAYS) {
      for (let i = 1; i <= (slotsPerDay[day] || 0); i++) {
        newSchedule.push({ id: generateId(), day, slotNumber: i, coachName: '', contactInfo: '', status: 'Need' });
      }
    }
    update('coachingSchedule', newSchedule);
  };

  const slotBg = (status) => {
    if (status === 'Confirmed') return 'bg-green-50 border-green-300';
    if (status === 'Need') return 'bg-orange-50 border-orange-300';
    return 'bg-gray-50 border-gray-300';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pgu-navy">Coaching Schedule</h2>
        <button
          onClick={resetSchedule}
          className="text-xs text-pgu-gray border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Reset Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {DAYS.map((day) => {
          const daySlots = schedule.filter((s) => s.day === day).sort((a, b) => a.slotNumber - b.slotNumber);
          const filled = daySlots.filter((s) => s.status === 'Confirmed').length;
          return (
            <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-pgu-navy text-white px-4 py-3 flex justify-between items-center">
                <span className="font-semibold">{day}</span>
                <span className="text-sm text-pgu-gold">{filled}/{daySlots.length} Filled</span>
              </div>
              <div className="p-2 space-y-2">
                {daySlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => openEdit(slot)}
                    className={`w-full text-left p-3 rounded border cursor-pointer transition-colors hover:shadow-sm ${slotBg(slot.status)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-pgu-gray font-medium">Slot {slot.slotNumber}</span>
                      <StatusBadge status={slot.status} />
                    </div>
                    {slot.coachName ? (
                      <>
                        <p className="font-medium text-sm text-pgu-navy">{slot.coachName}</p>
                        {slot.contactInfo && <p className="text-xs text-pgu-gray">{slot.contactInfo}</p>}
                      </>
                    ) : (
                      <p className="text-sm text-pgu-gray italic">Empty</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Coaching Slot">
        <div className="space-y-4">
          {roster.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-pgu-gray mb-1">Quick Assign from Roster</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value=""
                onChange={(e) => {
                  const coach = roster.find((c) => c.id === e.target.value);
                  if (coach) setForm({ ...form, coachName: coach.name, contactInfo: coach.contactInfo });
                }}
              >
                <option value="">Select a coach...</option>
                {roster.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Coach Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.coachName || ''}
              onChange={(e) => setForm({ ...form, coachName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Cell Number</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.contactInfo || ''}
              onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pgu-gray mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.status || 'Need'}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="flex-1 bg-pgu-gold text-white py-2 rounded-lg font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer">Save</button>
            <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-pgu-navy py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
