/*
# Add website_url column to colleges table

1. Modified Tables
- `colleges`
  - New column: `website_url` (text, nullable) — official website URL for the college.
  - Nullable so existing rows are unaffected; new rows may include a website URL.

2. Security
- No policy changes. Existing anon/authenticated CRUD policies already cover the new column.

3. Important notes
- This is a non-destructive ADD COLUMN. No data is lost.
- The admin form will include a new "Website URL" field; the college card will show a "Visit Website" button when a URL is present.
*/

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS website_url text;
