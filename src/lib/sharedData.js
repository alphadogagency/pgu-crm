import { requireSupabase, supabase } from './supabaseClient';

const STOP_DATA_TABLE = 'stop_data';
const APP_SETTINGS_TABLE = 'app_settings';
const SETUP_HINT = 'Run supabase/setup.sql in the Supabase SQL Editor if the database has not been set up yet.';

function raiseSupabaseError(context, error) {
  if (!error) return;
  throw new Error(`${context}: ${error.message}. ${SETUP_HINT}`);
}

export async function fetchStopData(stopId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(STOP_DATA_TABLE)
    .select('data')
    .eq('stop_id', stopId)
    .maybeSingle();

  raiseSupabaseError('Could not load stop data', error);
  return data?.data || null;
}

export async function createStopIfMissing(stopId, stopData) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(STOP_DATA_TABLE)
    .insert({ stop_id: stopId, data: stopData })
    .select('data')
    .single();

  if (error?.code === '23505') {
    return fetchStopData(stopId);
  }

  raiseSupabaseError('Could not seed stop data', error);
  return data?.data || stopData;
}

export async function upsertStopData(stopId, stopData) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(STOP_DATA_TABLE)
    .upsert(
      { stop_id: stopId, data: stopData, updated_at: new Date().toISOString() },
      { onConflict: 'stop_id' },
    )
    .select('data')
    .single();

  raiseSupabaseError('Could not save stop data', error);
  return data?.data || stopData;
}

export async function updateStopSection(stopId, section, value) {
  const client = requireSupabase();
  const { error } = await client.rpc('update_stop_section', {
    p_stop_id: stopId,
    p_section: section,
    p_value: value,
  });

  raiseSupabaseError('Could not save this section', error);
}

export async function fetchAllStopData() {
  const client = requireSupabase();
  const { data, error } = await client
    .from(STOP_DATA_TABLE)
    .select('stop_id, data');

  raiseSupabaseError('Could not load shared tour data', error);

  return Object.fromEntries((data || []).map((row) => [row.stop_id, row.data]));
}

export async function upsertManyStopData(stops) {
  const entries = Object.entries(stops);
  if (entries.length === 0) return 0;

  const client = requireSupabase();
  const now = new Date().toISOString();
  const rows = entries.map(([stopId, stopData]) => ({
    stop_id: stopId,
    data: stopData,
    updated_at: now,
  }));

  const { error } = await client
    .from(STOP_DATA_TABLE)
    .upsert(rows, { onConflict: 'stop_id' });

  raiseSupabaseError('Could not import backup data', error);
  return rows.length;
}

export async function fetchSetting(key, fallbackValue) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(APP_SETTINGS_TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle();

  raiseSupabaseError('Could not load app setting', error);
  return data?.value ?? fallbackValue;
}

export async function saveSetting(key, value) {
  const client = requireSupabase();
  const { error } = await client
    .from(APP_SETTINGS_TABLE)
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    );

  raiseSupabaseError('Could not save app setting', error);
}

export function subscribeToStopData(stopId, onChange) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`stop-data:${stopId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: STOP_DATA_TABLE, filter: `stop_id=eq.${stopId}` },
      (payload) => {
        if (payload.eventType !== 'DELETE' && payload.new?.data) {
          onChange(payload.new.data);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToAllStopData(onChange) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('stop-data:all')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: STOP_DATA_TABLE },
      (payload) => {
        if (payload.eventType === 'DELETE') {
          onChange(payload.old?.stop_id, null);
          return;
        }
        if (payload.new?.stop_id) {
          onChange(payload.new.stop_id, payload.new.data);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToSetting(key, onChange) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`app-setting:${key}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: APP_SETTINGS_TABLE, filter: `key=eq.${key}` },
      (payload) => {
        if (payload.eventType !== 'DELETE') {
          onChange(payload.new?.value);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
