import { useState } from 'react';
import { isAuthenticated, login } from '../utils/auth';

export default function PasswordGate({ children }) {
  const [authed,   setAuthed]   = useState(isAuthenticated);
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(false);
  const [showing,  setShowing]  = useState(false);

  if (authed) return children;

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) {
      setAuthed(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-pgu-navy flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/primary-logo.png" alt="Point Guard U" className="h-16 brightness-0 invert mb-4" />
          <div className="h-px w-16 bg-pgu-gold mb-4" />
          <p className="text-pgu-gold font-semibold tracking-wide">2026 Tour Hub</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">
              Staff Password
            </label>
            <div className="relative">
              <input
                type={showing ? 'text' : 'password'}
                autoFocus
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-pgu-gold transition-colors ${
                  error ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
              />
              <button
                type="button"
                onClick={() => setShowing(!showing)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer"
              >
                {showing ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-1.5">Incorrect password. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-pgu-gold hover:bg-pgu-gold-light text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
          >
            Enter
          </button>
        </form>

        <p className="text-white/20 text-xs text-center mt-8">#LeadYourSquad</p>
      </div>
    </div>
  );
}
