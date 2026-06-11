export const STOPS = [
  {
    id: 'limon',
    name: 'Limon',
    state: 'CO',
    label: 'Limon, CO',
    dates: 'June 8 – June 11',
    venue: 'Limon High School',
    slotsPerDay: { Monday: 5, Tuesday: 5, Wednesday: 5, Thursday: 4 },
  },
  {
    id: 'goodland',
    name: 'Goodland',
    state: 'KS',
    label: 'Goodland, KS',
    dates: 'June 15 – June 18',
    venue: 'Max Jones Fieldhouse',
    slotsPerDay: { Monday: 6, Tuesday: 6, Wednesday: 6, Thursday: 5 },
  },
  {
    id: 'marion',
    name: 'Marion',
    state: 'KS',
    label: 'Marion, KS',
    dates: 'June 22 – June 25',
    venue: 'Marion High School',
    slotsPerDay: { Monday: 5, Tuesday: 5, Wednesday: 5, Thursday: 4 },
  },
  {
    id: 'south-bend',
    name: 'South Bend',
    state: 'IN',
    label: 'South Bend, IN',
    dates: 'June 29 – July 2',
    venue: 'Mishawaka Fieldhouse',
    slotsPerDay: { Monday: 6, Tuesday: 6, Wednesday: 6, Thursday: 5 },
  },
];

export function getStop(id) {
  return STOPS.find((s) => s.id === id) || null;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
