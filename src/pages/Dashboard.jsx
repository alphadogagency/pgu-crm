import { useState } from 'react';
import { useStopContext } from '../context/StopDataContext';
import { DAYS } from '../data/stops';
import StatusBadge from '../components/StatusBadge';

const STAFF = ['Kyle', 'Larry', 'Linda', 'Rob', 'VJ'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function CampNotes({ data, update }) {
  const notes = data.campNotes || [];
  const [author,   setAuthor]   = useState(STAFF[0]);
  const [category, setCategory] = useState('worked');
  const [text,     setText]     = useState('');

  const add = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    update('campNotes', (prev) => [
      { id: generateId(), author, category, text: trimmed, createdAt: new Date().toISOString() },
      ...(prev || []),
    ]);
    setText('');
  };

  const remove = (id) => update('campNotes', (prev) => prev.filter((n) => n.id !== id));

  const categoryLabel = (cat) => cat === 'worked' ? 'What Worked' : "What Didn't";
  const categoryStyle = (cat) => cat === 'worked'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-4">
        What Worked &amp; What Didn't
      </h3>

      {/* Add note form */}
      <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
        <div className="flex gap-2">
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-pgu-navy"
          >
            {STAFF.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-pgu-navy flex-1"
          >
            <option value="worked">What Worked</option>
            <option value="didnt">What Didn't</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Add a thought…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button
            onClick={add}
            className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-pgu-gray italic">No notes yet. Add your first thought above.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="flex items-start gap-3">
              <span className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${categoryStyle(note.category)}`}>
                {categoryLabel(note.category)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-pgu-navy">{note.text}</p>
                <p className="text-xs text-pgu-gray mt-0.5">— {note.author}</p>
              </div>
              <button
                onClick={() => remove(note.id)}
                className="text-gray-300 hover:text-red-400 text-xs transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OutstandingItems({ data }) {
  const schedule   = data.coachingSchedule  || [];
  const sponsors   = data.sponsors          || [];
  const volunteers = data.volunteerRoles    || [];
  const gymFee     = data.gymFee            || {};
  const reminders  = data.reminders         || [];

  const items = [];

  // Coaching slots still needed (not Confirmed and not N/A)
  const neededSlots = schedule.filter((s) => s.status === 'Need').length;
  if (neededSlots > 0) {
    items.push({ level: 'warn', text: `${neededSlots} Coaching Slot${neededSlots !== 1 ? 's' : ''} Still Needed` });
  }

  // Sponsors not confirmed — exclude Cash sponsors
  const needSponsors = sponsors.filter((s) => s.status === 'Need' && s.sponsorType !== 'Cash');
  needSponsors.forEach((s) => {
    items.push({ level: 'warn', text: `${s.sponsorType} Sponsor Not Confirmed` });
  });

  // Gym fee
  if (gymFee.status === 'Need') {
    items.push({ level: 'warn', text: 'Gym Fee Not Confirmed' });
  }

  // Volunteer roles
  const neededRoles = volunteers.filter((v) => v.status === 'Need').length;
  if (neededRoles > 0) {
    items.push({ level: 'info', text: `${neededRoles} On-Site Role${neededRoles !== 1 ? 's' : ''} Unfilled` });
  }

  // Urgent (red) reminders
  const urgentOpen = reminders.filter((r) => r.urgency === 'Red' && !r.completed);
  if (urgentOpen.length > 0) {
    items.push({ level: 'urgent', text: `${urgentOpen.length} Urgent Reminder${urgentOpen.length !== 1 ? 's' : ''} Open` });
  }

  const allClear = items.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-3">Outstanding Items</h3>

      {allClear ? (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-xl">✅</span>
          <span className="font-medium text-sm">All Clear — You're Ready!</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 shrink-0">
                {item.level === 'urgent' ? '🔴' : item.level === 'warn' ? '🟡' : '🔵'}
              </span>
              <span className={
                item.level === 'urgent'
                  ? 'text-red-700 font-medium'
                  : item.level === 'warn'
                  ? 'text-amber-700'
                  : 'text-pgu-gray'
              }>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data, stop, update } = useStopContext();

  const schedule   = data.coachingSchedule || [];
  const sponsors   = data.sponsors         || [];
  const volunteers = data.volunteerRoles   || [];
  const gymFee     = data.gymFee           || {};
  const reminders  = data.reminders        || [];

  const filledSlots = schedule.filter((s) => s.status === 'Confirmed').length;
  const totalSlots  = schedule.length;

  const dayFills = DAYS.map((day) => {
    const daySlots = schedule.filter((s) => s.day === day);
    const filled   = daySlots.filter((s) => s.status === 'Confirmed').length;
    return { day, filled, total: daySlots.length };
  });

  const filledVolunteers = volunteers.filter((v) => v.status === 'Confirmed').length;
  const urgentReminders  = reminders.filter((r) => r.urgency === 'Red' && !r.completed);

  return (
    <div className="space-y-6">
      {/* Stop Header */}
      <div>
        <h2 className="text-2xl font-bold text-pgu-navy">Dashboard — {stop.label}</h2>
        <p className="text-pgu-gray text-sm mt-1">
          {stop.venue && <span>{stop.venue} · </span>}
          {stop.dates}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Coaching Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-3">Coaching Schedule</h3>
          <p className="text-3xl font-bold text-pgu-navy">
            {filledSlots}<span className="text-lg text-pgu-gray font-normal">/{totalSlots}</span>
          </p>
          <p className="text-sm text-pgu-gray mb-4">Slots Filled</p>
          <div className="space-y-2">
            {dayFills.map(({ day, filled, total }) => (
              <div key={day}>
                <div className="flex justify-between text-xs text-pgu-gray mb-1">
                  <span>{day}</span>
                  <span>{filled}/{total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pgu-gold rounded-full h-2 transition-all"
                    style={{ width: `${total > 0 ? (filled / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsor Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-3">Sponsors</h3>
          <div className="space-y-3">
            {sponsors.map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-pgu-navy">{s.sponsorType}</p>
                  {s.sponsorName && <p className="text-sm text-pgu-gray">{s.sponsorName}</p>}
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Volunteers + Gym Fee */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-2">On-Site Roles</h3>
            <p className="text-3xl font-bold text-pgu-navy">
              {filledVolunteers}<span className="text-lg text-pgu-gray font-normal">/{volunteers.length}</span>
            </p>
            <p className="text-sm text-pgu-gray">Roles Filled</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-pgu-gray uppercase tracking-wide mb-2">Gym Fee</h3>
            <div className="flex items-center gap-3">
              <StatusBadge status={gymFee.status} />
              {gymFee.amount && <span className="font-semibold text-pgu-navy">{gymFee.amount}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Items */}
      <OutstandingItems data={data} />

      {/* Camp Notes */}
      <CampNotes data={data} update={update} />

      {/* Urgent Reminders */}
      {urgentReminders.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h3 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-3">Urgent Reminders</h3>
          <div className="space-y-2">
            {urgentReminders.map((r) => (
              <div key={r.id} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-red-900">{r.title}</p>
                  {r.details && <p className="text-sm text-red-700">{r.details}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
