import { useState, useCallback, useEffect, useRef } from 'react';
import { createSeedData, fillMissingStopSections, generateId } from '../data/seedData';
import {
  createStopIfMissing,
  fetchStopData,
  subscribeToStopData,
  updateStopSection,
  upsertStopData,
} from '../lib/sharedData';

export function useStopData(stopId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const dataRef = useRef(null);

  const setSharedData = useCallback((nextData) => {
    dataRef.current = nextData;
    setData(nextData);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadStop() {
      setLoading(true);
      setError('');

      try {
        let nextData = await fetchStopData(stopId);
        if (!nextData) {
          nextData = await createStopIfMissing(stopId, createSeedData(stopId));
        } else {
          const normalized = fillMissingStopSections(stopId, nextData);
          nextData = normalized.data;
          if (normalized.changed) {
            await upsertStopData(stopId, nextData);
          }
        }
        if (!active) return;
        setSharedData(nextData);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStop();

    const unsubscribe = subscribeToStopData(stopId, (nextData) => {
      setSharedData(fillMissingStopSections(stopId, nextData).data);
      setError('');
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [reloadKey, setSharedData, stopId]);

  const update = useCallback((section, updater) => {
    const previous = dataRef.current;
    if (!previous) return;

    const nextSection = typeof updater === 'function' ? updater(previous[section]) : updater;
    const nextData = { ...previous, [section]: nextSection };
    setSharedData(nextData);

    updateStopSection(stopId, section, nextSection).catch((err) => {
      setSharedData(previous);
      setError(err.message);
    });
  }, [setSharedData, stopId]);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  return { data, loading, error, reload, update, generateId };
}
