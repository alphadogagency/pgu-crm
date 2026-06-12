# Supabase Setup

1. Open the `pgu-crm` Supabase project.
2. Go to SQL Editor and run the full contents of `supabase/setup.sql`.
3. Go to Project Settings > API.
4. Copy the Project URL and anon public key.
5. Create `.env.local` from `.env.example` and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Run the app locally with `npm run dev`.
7. In the current production/localStorage app, use Export Backup from the best browser/device.
8. In the Supabase-enabled app, use Import Backup to upload that JSON into the shared database.

This MVP intentionally keeps the existing staff password gate. The anon key is safe to expose in a browser app, but the current RLS policies allow anyone with the anon key to read and write these two app tables. Move to Supabase Auth or a backend API before treating this as strong security.
