import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { STOPS } from '../data/stops';
import SocialLinks from '../components/SocialLinks';
import { lock } from '../utils/auth';

const LEVEL_VALUES = { Platinum: 2000, Gold: 1000, Silver: 500, Bronze: 250 };

function getTotalCashSponsorship() {
  let total = 0;
  for (const stop of STOPS) {
    try {
      const raw = window.localStorage.getItem(`pgu-stop-${stop.id}`);
      if (!raw) continue;
      const data = JSON.parse(raw);
      const cashSponsors = (data.sponsors || []).filter(
        (s) => s.sponsorType === 'Cash' && s.status === 'Confirmed'
      );
      for (const s of cashSponsors) {
        total += LEVEL_VALUES[s.level] || 0;
      }
    } catch {
      // skip
    }
  }
  return total;
}

function exportAllData() {
  const exportData = { exportedAt: new Date().toISOString(), stops: {} };
  for (const stop of STOPS) {
    try {
      const raw = window.localStorage.getItem(`pgu-stop-${stop.id}`);
      if (raw) exportData.stops[stop.id] = JSON.parse(raw);
    } catch {
      // skip
    }
  }
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `pgu-tour-hub-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importAllData(file, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const stops = parsed.stops || parsed; // support both new and raw formats
      let count = 0;
      for (const stopId of Object.keys(stops)) {
        window.localStorage.setItem(`pgu-stop-${stopId}`, JSON.stringify(stops[stopId]));
        count++;
      }
      onDone(count);
    } catch {
      alert('Could not read backup file. Make sure it is a valid PGU Tour Hub backup.');
    }
  };
  reader.readAsText(file);
}

export default function StopSelector() {
  const totalCash = getTotalCashSponsorship();
  const importRef = useRef(null);
  const [importMsg, setImportMsg] = useState('');

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importAllData(file, (count) => {
      setImportMsg(`Restored ${count} stop(s) successfully! Refreshing…`);
      setTimeout(() => window.location.reload(), 1500);
    });
    e.target.value = '';
  }

  return (
    <div className="min-h-screen bg-pgu-navy flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <img src="/primary-logo.png" alt="Point Guard U" className="h-10 brightness-0 invert" />
          <div className="h-6 w-px bg-pgu-gold" />
          <span className="text-pgu-gold font-semibold tracking-wide">2026 Tour Hub</span>
        </div>
        <button onClick={lock} className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer" title="Lock app">
          🔒 Lock
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Select Tour Stop</h1>
        <p className="text-pgu-gold mb-2">#LeadYourSquad</p>
        <a
          href="https://camps.active.com/pointguardu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-pgu-gold text-xs uppercase tracking-widest mb-10 transition-colors"
        >
          Active.com Dashboard ↗
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {STOPS.map((stop) => (
            <Link
              key={stop.id}
              to={`/${stop.id}`}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pgu-gold/50 rounded-xl p-6 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-white group-hover:text-pgu-gold transition-colors">
                  {stop.name} <span className="text-white/50 text-sm font-normal">{stop.state}</span>
                </h2>
                <span className="text-white/30 group-hover:text-pgu-gold text-2xl transition-colors">→</span>
              </div>
              <p className="text-sm text-pgu-gold font-medium">{stop.dates}</p>
            </Link>
          ))}
        </div>

        {/* Cash Sponsorship Total */}
        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">2026 Tour</p>
          <p className="text-white text-lg font-semibold">
            Total Cash Sponsorship:{' '}
            <span className="text-pgu-gold text-2xl font-bold">
              ${totalCash.toLocaleString()}
            </span>
          </p>
        </div>

        {/* Backup Controls */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-white/30 text-xs uppercase tracking-widest">Data Backup</p>
          <div className="flex gap-3">
            <button
              onClick={exportAllData}
              className="flex items-center gap-2 px-4 py-2 bg-pgu-gold/10 hover:bg-pgu-gold/20 border border-pgu-gold/30 hover:border-pgu-gold/60 text-pgu-gold text-sm font-medium rounded-lg transition-all duration-200"
            >
              ⬇ Export Backup
            </button>
            <button
              onClick={() => importRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
              ⬆ Import Backup
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          {importMsg && (
            <p className="text-green-400 text-sm font-medium">{importMsg}</p>
          )}
          <p className="text-white/20 text-xs">Export saves all stops to a JSON file. Import restores from that file.</p>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-white/30 text-xs uppercase tracking-widest">Follow PGU</p>
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
