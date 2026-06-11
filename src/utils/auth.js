const AUTH_KEY   = 'pgu-auth-ts';
const EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PASSWORD   = 'WILDcats17';

export function isAuthenticated() {
  try {
    const ts = window.localStorage.getItem(AUTH_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < EXPIRES_MS;
  } catch { return false; }
}

export function login(password) {
  if (password !== PASSWORD) return false;
  window.localStorage.setItem(AUTH_KEY, String(Date.now()));
  return true;
}

export function lock() {
  window.localStorage.removeItem(AUTH_KEY);
  window.location.reload();
}
