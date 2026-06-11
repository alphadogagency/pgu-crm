const colors = {
  Confirmed: 'bg-status-confirmed text-white',
  Need: 'bg-status-need text-white',
  'N/A': 'bg-status-na text-white',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors[status] || 'bg-gray-300 text-gray-700'}`}>
      {status}
    </span>
  );
}
