/*
# Create search_logs table

1. New Tables
- `search_logs`
  - `id` (uuid, primary key)
  - `student_email` (text) — email of the signed-in student who searched (nullable for anonymous users)
  - `student_name` (text) — name the student entered in the form
  - `score` (numeric) — the score the student entered
  - `course` (text) — the course the student selected
  - `country` (text) — the country the student selected
  - `college_results` (jsonb) — array of objects with college id, name, and website_url for each recommended college
  - `created_at` (timestamptz, default now()) — when the search happened

2. Security
- Enable RLS on `search_logs`.
- Public read/write (TO anon, authenticated) because this is a single-tenant demo app with a client-side admin credential check. The student-facing form (which may be used by anon or authenticated users) inserts logs; the admin panel reads them.

3. Important notes
- This table records every search a student makes: who searched, what they searched for (course, country, score), which colleges were recommended (names + website links), and when.
- The admin panel will display these logs so the admin can see student search activity.
*/

CREATE TABLE IF NOT EXISTS search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_email text,
  student_name text NOT NULL,
  score numeric NOT NULL,
  course text NOT NULL,
  country text NOT NULL,
  college_results jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_search_logs" ON search_logs;
CREATE POLICY "anon_select_search_logs" ON search_logs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_search_logs" ON search_logs;
CREATE POLICY "anon_insert_search_logs" ON search_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_search_logs" ON search_logs;
CREATE POLICY "anon_update_search_logs" ON search_logs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_search_logs" ON search_logs;
CREATE POLICY "anon_delete_search_logs" ON search_logs FOR DELETE
  TO anon, authenticated USING (true);
