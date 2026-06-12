import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSetting, saveSetting, subscribeToSetting } from '../lib/sharedData';

const EQUIPMENT_LIBRARY_KEY = 'equipment_library';

function normalizeLibrary(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function useEquipmentLibrary() {
  const [library, setLibrary] = useState([]);
  const [error, setError] = useState('');
  const libraryRef = useRef([]);

  const setSharedLibrary = useCallback((nextLibrary) => {
    libraryRef.current = nextLibrary;
    setLibrary(nextLibrary);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadLibrary() {
      try {
        const nextLibrary = normalizeLibrary(await fetchSetting(EQUIPMENT_LIBRARY_KEY, []));
        if (!active) return;
        setSharedLibrary(nextLibrary);
        setError('');
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    loadLibrary();

    const unsubscribe = subscribeToSetting(EQUIPMENT_LIBRARY_KEY, (value) => {
      setSharedLibrary(normalizeLibrary(value));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [setSharedLibrary]);

  const addToLibrary = useCallback(async (itemName) => {
    const trimmed = itemName.trim();
    if (!trimmed) return;

    const current = libraryRef.current;
    if (current.some((item) => item.toLowerCase() === trimmed.toLowerCase())) return;

    const nextLibrary = [...current, trimmed];
    setSharedLibrary(nextLibrary);

    try {
      await saveSetting(EQUIPMENT_LIBRARY_KEY, nextLibrary);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [setSharedLibrary]);

  return { library, addToLibrary, error };
}
