import { DAYS, getStop } from './stops.js';

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function defaultEquipmentList() {
  const items = [
    'Basketballs',
    'Ball Cart / Rack',
    'Cones',
    'Pinnies / Scrimmage Vests',
    'Scorebook',
    'Scoreboard',
    'Portable Speaker',
    'Whiteboard & Markers',
    'First Aid Kit',
    'Ice & Coolers',
    'Water Jugs / Cups',
    'Extension Cords / Power Strips',
    'Folding Tables',
    'Registration Clipboards & Pens',
    'Camp Shirts / Merch',
    'Trophies / Awards',
    'Banners / Signage',
    'Phone Chargers / Power Banks',
  ];
  return items.map((item) => ({ id: generateId(), item, checked: false, notes: '' }));
}

const DEFAULT_REGISTRATION = { capacity: 0, registered: 0, waitlist: 0, notes: '' };

function buildSchedule(stopId) {
  const stop = getStop(stopId);
  const slotsPerDay = stop?.slotsPerDay || { Monday: 4, Tuesday: 4, Wednesday: 4, Thursday: 4 };
  const slots = [];
  for (const day of DAYS) {
    for (let slot = 1; slot <= slotsPerDay[day]; slot++) {
      slots.push({ id: generateId(), day, slotNumber: slot, coachName: '', contactInfo: '', status: 'Need' });
    }
  }
  return slots;
}

function emptyStop(stopId) {
  return {
    coachingSchedule: buildSchedule(stopId),
    coachRoster: [],
    keyPersonnel: [],
    sponsors: [
      { id: generateId(), sponsorType: 'Food', sponsorName: '', contactInfo: '', level: '', status: 'Need', notes: '' },
      { id: generateId(), sponsorType: 'Lodging', sponsorName: '', contactInfo: '', level: '', status: 'Need', notes: '' },
      { id: generateId(), sponsorType: 'Cash', sponsorName: '', contactInfo: '', level: '', status: 'Need', notes: '' },
    ],
    gymFee: { status: 'Need', amount: '', notes: '' },
    volunteerRoles: [
      { id: generateId(), roleName: 'Registration Table', assignedTo: '', contactInfo: '', status: 'Need' },
      { id: generateId(), roleName: 'Food Runner', assignedTo: '', contactInfo: '', status: 'Need' },
      { id: generateId(), roleName: 'Gym Set-Up', assignedTo: '', contactInfo: '', status: 'Need' },
      { id: generateId(), roleName: 'Photo/Video', assignedTo: '', contactInfo: '', status: 'Need' },
    ],
    reminders: [],
    contacts: [],
    rollovers: [],
    equipmentList: defaultEquipmentList(),
    registration: { ...DEFAULT_REGISTRATION },
    campNotes: [],
  };
}

function goodlandSeed() {
  const coachRoster = [
    { id: generateId(), name: 'Jake Marshall',   contactInfo: '(515) 988-0690', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Annie Kassongo',   contactInfo: '(405) 549-7281', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Jerrod Stanford',  contactInfo: '(620) 385-0273', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Emma Lehman',      contactInfo: '(785) 821-3295', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Talexa Weeter',    contactInfo: '(785) 772-7359', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Braydon Summers',  contactInfo: '(785) 852-1100', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Josh Gooch',       contactInfo: '(620) 376-8139', shirtSize: '', notes: '' },
    { id: generateId(), name: 'Brandon Gehring',  contactInfo: '(785) 213-1773', shirtSize: '', notes: '' },
  ];

  const keyPersonnel = [
    { id: generateId(), name: 'Marty Lehman', contactInfo: '(785) 821-4640', role: 'Key Personnel', notes: '' },
    { id: generateId(), name: 'Bill Biermann', contactInfo: 'bill.biermann@usd352.org', role: 'Key Personnel', notes: '' },
    { id: generateId(), name: 'Zach McNall', contactInfo: '(785) 821-3785', role: 'Key Personnel', notes: '' },
    { id: generateId(), name: 'Mikayla Biermann', contactInfo: '(785) 821-6121', role: 'Key Personnel', notes: '' },
  ];

  const sponsors = [
    { id: generateId(), sponsorType: 'Food', sponsorName: '', contactInfo: '', level: '', status: 'Need', notes: '' },
    { id: generateId(), sponsorType: 'Lodging', sponsorName: 'Paul Flanders', contactInfo: '', level: '', status: 'Need', notes: 'Last Year: Holiday Inn & Suites' },
    { id: generateId(), sponsorType: 'Cash', sponsorName: '', contactInfo: '', level: '', status: 'Need', notes: '' },
  ];

  const volunteerRoles = [
    { id: generateId(), roleName: 'Registration Table', assignedTo: '', contactInfo: '', status: 'Need' },
    { id: generateId(), roleName: 'Food Runner', assignedTo: '', contactInfo: '', status: 'Need' },
    { id: generateId(), roleName: 'Gym Set-Up', assignedTo: '', contactInfo: '', status: 'Need' },
    { id: generateId(), roleName: 'Photo/Video', assignedTo: "Linda O'Connor", contactInfo: '', status: 'Confirmed' },
  ];

  const reminders = [
    { id: generateId(), title: 'Schemm Trophy', details: 'Thursday @ TBD', urgency: 'Orange', createdAt: new Date().toISOString(), completed: false },
  ];

  // Build master contacts from all sections
  const contacts = [];
  for (const c of coachRoster) {
    contacts.push({ id: generateId(), name: c.name, contactInfo: c.contactInfo, role: 'Coach', organization: '', notes: c.notes });
  }
  for (const p of keyPersonnel) {
    contacts.push({ id: generateId(), name: p.name, contactInfo: p.contactInfo, role: 'Key Personnel', organization: '', notes: p.notes });
  }
  for (const v of volunteerRoles) {
    if (v.assignedTo) {
      contacts.push({ id: generateId(), name: v.assignedTo, contactInfo: v.contactInfo, role: 'On-Site', organization: '', notes: '' });
    }
  }

  return {
    coachingSchedule: buildSchedule('goodland'),
    coachRoster,
    keyPersonnel,
    sponsors,
    gymFee: { status: 'Confirmed', amount: 'FREE', notes: '' },
    volunteerRoles,
    reminders,
    contacts,
    rollovers: [],
    equipmentList: defaultEquipmentList(),
    registration: { ...DEFAULT_REGISTRATION },
    campNotes: [],
  };
}

export function createSeedData(stopId) {
  if (stopId === 'goodland') return goodlandSeed();
  return emptyStop(stopId);
}
