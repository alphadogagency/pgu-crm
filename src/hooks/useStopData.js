import { useState, useCallback } from 'react';
import { createSeedData, generateId } from '../data/seedData';

function readStop(stopId) {
  try {
    const raw = window.localStorage.getItem(`pgu-stop-${stopId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStop(stopId, data) {
  window.localStorage.setItem(`pgu-stop-${stopId}`, JSON.stringify(data));
}

export function useStopData(stopId) {
  const [data, setData] = useState(() => {
    // If any data exists for this stop, always use it — no exceptions
    const existing = readStop(stopId);
    if (existing) return existing;

    // Truly first visit — seed once and never again
    const seed = createSeedData(stopId);
    writeStop(stopId, seed);
    window.localStorage.setItem(`pgu-seeded-v1-${stopId}`, 'true');
    return seed;
  });

  const update = useCallback((section, updater) => {
    setData((prev) => {
      const next = {
        ...prev,
        [section]: typeof updater === 'function' ? updater(prev[section]) : updater,
      };
      writeStop(stopId, next);
      return next;
    });
  }, [stopId]);

  return { data, update, generateId };
}
