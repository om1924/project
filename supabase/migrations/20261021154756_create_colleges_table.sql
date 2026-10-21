/*
# Create colleges table for University Finder

1. New Tables
- `colleges`
  - `id` (uuid, primary key)
  - `name` (text, not null) — college/university name
  - `course` (text, not null) — course offered (MBA, B.Tech, Computer Science, MBBS, Law)
  - `country` (text, not null) — country where the college is located
  - `image_url` (text, not null) — campus photo URL
  - `intake` (text, not null) — admission intake / seats info
  - `eligibility` (text, not null) — eligibility criteria
  - `fee_structure` (text, not null) — fee details
  - `hostel_mess` (text, not null) — hostel & mess facilities near the college
  - `min_score` (numeric, not null, default 0) — minimum qualifying score required (out of 100)
  - `ranking` (integer) — college ranking (lower = better)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `colleges`.
- Public read/write because this is a single-tenant demo app (admin uses a client-side credential check, no Supabase auth). All four CRUD verbs allow `anon, authenticated`.

3. Important notes
- The student-facing recommendation form reads colleges; the admin panel (client-side login "om"/"om123") writes them. Since there is no sign-in screen, anon must be allowed on every policy or the app cannot function.
- Seed data inserts ~40 colleges across MBA, B.Tech, Computer Science, MBBS, and Law across India, USA, UK, Canada, Australia, Germany, and Singapore.
*/

CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  course text NOT NULL,
  country text NOT NULL,
  image_url text NOT NULL,
  intake text NOT NULL,
  eligibility text NOT NULL,
  fee_structure text NOT NULL,
  hostel_mess text NOT NULL,
  min_score numeric NOT NULL DEFAULT 0,
  ranking integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_colleges" ON colleges;
CREATE POLICY "anon_select_colleges" ON colleges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_colleges" ON colleges;
CREATE POLICY "anon_insert_colleges" ON colleges FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_colleges" ON colleges;
CREATE POLICY "anon_update_colleges" ON colleges FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_colleges" ON colleges;
CREATE POLICY "anon_delete_colleges" ON colleges FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO colleges (name, course, country, image_url, intake, eligibility, fee_structure, hostel_mess, min_score, ranking) VALUES
('Indian Institute of Management Ahmedabad', 'MBA', 'India', 'https://images.pexels.com/photos/19554793/pexels-photo-19554793.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 390 seats per batch through CAT counselling.', 'Bachelor''s degree with 50% marks and valid CAT score.', 'Approx INR 23 lakh for the full 2-year programme.', 'On-campus hostels with mess serving vegetarian and non-veg meals; multiple PG options within 1 km.', 85, 1),
('Indian Institute of Management Bangalore', 'MBA', 'India', 'https://images.pexels.com/photos/2566121/pexels-photo-2566121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 480 seats across the postgraduate programme.', 'Bachelor''s degree with 50% marks and valid CAT score.', 'Approx INR 24.5 lakh for the 2-year programme.', 'Campus hostels with attached mess; nearby paying-guest houses in Koramangala.', 83, 2),
('Indian Institute of Management Calcutta', 'MBA', 'India', 'https://images.pexels.com/photos/36899861/pexels-photo-36899861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 480 seats per batch.', 'Bachelor''s degree with 50% marks and valid CAT score.', 'Approx INR 23 lakh for the 2-year programme.', 'Four hostels on campus with mess facility; PG options in Joka area.', 82, 3),
('Faculty of Management Studies, Delhi', 'MBA', 'India', 'https://images.pexels.com/photos/20200756/pexels-photo-20200756.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 120 seats per batch.', 'Bachelor''s degree with 50% marks and valid CAT score.', 'Approx INR 2 lakh for the 2-year programme.', 'University hostels with mess; many PG options in North Campus.', 75, 4),
('Symbiosis Institute of Business Management, Pune', 'MBA', 'India', 'https://images.pexels.com/photos/35314982/pexels-photo-35314982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 180 seats per batch.', 'Bachelor''s degree with 50% marks and SNAP score.', 'Approx INR 22 lakh for the 2-year programme.', 'On-campus hostels with mess; PG accommodations in Viman Nagar nearby.', 70, 5),
('Harvard Business School', 'MBA', 'United States', 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 930 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience, essays and interview.', 'Approx USD 112,000 per year including living.', 'On-campus housing with dining halls; off-campus apartments in Boston.', 90, 1),
('Stanford Graduate School of Business', 'MBA', 'United States', 'https://images.pexels.com/photos/30719244/pexels-photo-30719244.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 420 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, essays, interview.', 'Approx USD 120,000 per year.', 'On-campus residences with dining; Palo Alto housing available.', 90, 2),
('Wharton School, UPenn', 'MBA', 'United States', 'https://images.pexels.com/photos/17792668/pexels-photo-17792668.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 870 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, essays, interview.', 'Approx USD 115,000 per year.', 'On-campus housing with dining; Philadelphia apartments nearby.', 88, 3),
('London Business School', 'MBA', 'United Kingdom', 'https://images.pexels.com/photos/39345684/pexels-photo-39345684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 500 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience, interview.', 'Approx GBP 95,000 for the programme.', 'Limited on-campus housing; many private rentals across London.', 87, 1),
('Said Business School, Oxford', 'MBA', 'United Kingdom', 'https://images.pexels.com/photos/29704450/pexels-photo-29704450.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 320 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, essays, interview.', 'Approx GBP 71,000 for the 1-year programme.', 'College accommodation with dining; private housing in Oxford.', 86, 2),
('Rotman School of Management, Toronto', 'MBA', 'Canada', 'https://images.pexels.com/photos/31156623/pexels-photo-31156623.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 260 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, essays, interview.', 'Approx CAD 65,000 per year.', 'Graduate residence with dining; downtown Toronto apartments.', 80, 1),
('Ivey Business School, Western Ontario', 'MBA', 'Canada', 'https://images.pexels.com/photos/31156622/pexels-photo-31156622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 150 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience.', 'Approx CAD 60,000 for the programme.', 'On-campus housing with dining; London Ontario rentals.', 78, 2),
('Melbourne Business School', 'MBA', 'Australia', 'https://images.pexels.com/photos/39289023/pexels-photo-39289023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 200 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience, interview.', 'Approx AUD 90,000 for the programme.', 'College housing with dining; Melbourne city apartments.', 82, 1),
('AGSM, University of New South Wales', 'MBA', 'Australia', 'https://images.pexels.com/photos/39077560/pexels-photo-39077560.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 120 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience.', 'Approx AUD 85,000 for the programme.', 'On-campus residences with dining; Sydney suburb housing.', 80, 2),
('ESMT Berlin', 'MBA', 'Germany', 'https://images.pexels.com/photos/11932106/pexels-photo-11932106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 100 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience.', 'Approx EUR 40,000 for the programme.', 'Assisted housing with shared kitchens; Berlin rental market.', 78, 1),
('NUS Business School', 'MBA', 'Singapore', 'https://images.pexels.com/photos/27907978/pexels-photo-27907978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 100 seats per cohort.', 'Bachelor''s degree, GMAT/GRE, work experience, interview.', 'Approx SGD 70,000 for the programme.', 'On-campus housing with dining halls; private HDB rentals.', 85, 1),
('Indian Institute of Technology Bombay', 'B.Tech', 'India', 'https://images.pexels.com/photos/19014974/pexels-photo-19014974.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 880 seats across branches through JEE Advanced.', '10+2 with Physics, Chemistry, Maths and valid JEE Advanced rank.', 'Approx INR 8 lakh for the 4-year programme.', '11 hostels with mess facilities; PG options in Powai nearby.', 80, 1),
('Indian Institute of Technology Delhi', 'B.Tech', 'India', 'https://images.pexels.com/photos/5147366/pexels-photo-5147366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 850 seats across branches through JEE Advanced.', '10+2 with Physics, Chemistry, Maths and valid JEE Advanced rank.', 'Approx INR 8 lakh for the 4-year programme.', '10 hostels with mess; many PG options in Hauz Khas.', 80, 2),
('Indian Institute of Technology Madras', 'B.Tech', 'India', 'https://images.pexels.com/photos/37328679/pexels-photo-37328679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 830 seats across branches through JEE Advanced.', '10+2 with Physics, Chemistry, Maths and valid JEE Advanced rank.', 'Approx INR 8 lakh for the 4-year programme.', 'Hostels with mess inside the green campus; PG options in Adyar.', 80, 3),
('Birla Institute of Technology and Science, Pilani', 'B.Tech', 'India', 'https://images.pexels.com/photos/36152126/pexels-photo-36152126.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 1000 seats through BITSAT.', '10+2 with Physics, Chemistry, Maths and valid BITSAT score.', 'Approx INR 16 lakh for the 4-year programme.', 'Hostels with mess on campus; PG accommodations in Pilani town.', 70, 4),
('Vellore Institute of Technology', 'B.Tech', 'India', 'https://images.pexels.com/photos/5147362/pexels-photo-5147362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 5000 seats across branches through VITEEE.', '10+2 with Physics, Chemistry, Maths and valid VITEEE rank.', 'Approx INR 7 lakh for the 4-year programme.', 'Multiple hostels with mess; PG options around Vellore.', 60, 5),
('Massachusetts Institute of Technology', 'B.Tech', 'United States', 'https://images.pexels.com/photos/396304/pexels-photo-396304.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 1100 seats per cohort.', '10+2 with strong academics, SAT/ACT, essays, interview.', 'Approx USD 55,000 per year.', 'On-campus housing with dining; Cambridge apartments.', 90, 1),
('Stanford University', 'B.Tech', 'United States', 'https://images.pexels.com/photos/30719244/pexels-photo-30719244.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 1700 seats per cohort.', '10+2 with strong academics, SAT/ACT, essays.', 'Approx USD 56,000 per year.', 'On-campus residences with dining; Palo Alto housing.', 90, 2),
('University of California, Berkeley', 'B.Tech', 'United States', 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 1000 seats per cohort.', '10+2 with strong academics, SAT/ACT, essays.', 'Approx USD 45,000 per year.', 'On-campus housing with dining; Berkeley rentals.', 85, 3),
('Imperial College London', 'B.Tech', 'United Kingdom', 'https://images.pexels.com/photos/2305096/pexels-photo-2305096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 600 seats per cohort.', 'A-levels with Maths and Physics, English proficiency.', 'Approx GBP 35,000 per year.', 'Halls of residence with dining; London private housing.', 82, 1),
('University of Toronto', 'B.Tech', 'Canada', 'https://images.pexels.com/photos/31156623/pexels-photo-31156623.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 1200 seats per cohort.', '10+2 with strong academics, IELTS/TOEFL.', 'Approx CAD 60,000 per year.', 'Residence with dining; Toronto apartments.', 80, 1),
('Technical University of Munich', 'B.Tech', 'Germany', 'https://images.pexels.com/photos/11932106/pexels-photo-11932106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 400 seats per cohort.', '10+2 with strong academics, German language proficiency.', 'No tuition fee (public university); semester fee EUR 150.', 'Student dorms with shared kitchens; Munich rentals.', 75, 1),
('Nanyang Technological University', 'B.Tech', 'Singapore', 'https://images.pexels.com/photos/27907978/pexels-photo-27907978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 600 seats per cohort.', '10+2 with strong academics, SAT, English proficiency.', 'Approx SGD 38,000 per year.', 'On-campus halls with dining; private HDB rentals.', 82, 1),
('Indian Institute of Technology Bombay', 'Computer Science', 'India', 'https://images.pexels.com/photos/19014974/pexels-photo-19014974.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 120 seats for CSE through JEE Advanced.', '10+2 with Physics, Chemistry, Maths and valid JEE Advanced rank.', 'Approx INR 8 lakh for the 4-year programme.', 'Hostels with mess on campus; PG options in Powai.', 85, 1),
('International Institute of Information Technology, Hyderabad', 'Computer Science', 'India', 'https://images.pexels.com/photos/5147366/pexels-photo-5147366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 250 seats through JEE Main/KVPY.', '10+2 with Physics, Chemistry, Maths and valid entrance rank.', 'Approx INR 12 lakh for the 4-year programme.', 'Hostels with mess on campus; PG options in Gachibowli.', 75, 2),
('Delhi Technological University', 'Computer Science', 'India', 'https://images.pexels.com/photos/20200756/pexels-photo-20200756.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 200 seats for CSE through JAC Delhi.', '10+2 with Physics, Chemistry, Maths and valid JEE Main rank.', 'Approx INR 7 lakh for the 4-year programme.', 'Hostels with mess on campus; PG options in Bawana.', 70, 3),
('Carnegie Mellon University', 'Computer Science', 'United States', 'https://images.pexels.com/photos/17792668/pexels-photo-17792668.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 200 seats for CS.', '10+2 with strong academics, SAT/ACT, essays.', 'Approx USD 58,000 per year.', 'On-campus housing with dining; Pittsburgh apartments.', 90, 1),
('University of Illinois Urbana-Champaign', 'Computer Science', 'United States', 'https://images.pexels.com/photos/396304/pexels-photo-396304.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 300 seats for CS.', '10+2 with strong academics, SAT/ACT, essays.', 'Approx USD 35,000 per year.', 'On-campus housing with dining; Champaign rentals.', 85, 2),
('University of Edinburgh', 'Computer Science', 'United Kingdom', 'https://images.pexels.com/photos/29704450/pexels-photo-29704450.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 250 seats for CS.', 'A-levels with Maths, English proficiency.', 'Approx GBP 33,000 per year.', 'Halls of residence with dining; Edinburgh rentals.', 80, 1),
('University of Waterloo', 'Computer Science', 'Canada', 'https://images.pexels.com/photos/31156622/pexels-photo-31156622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 400 seats for CS.', '10+2 with strong academics, IELTS/TOEFL.', 'Approx CAD 50,000 per year.', 'Residence with dining; Waterloo student housing.', 82, 1),
('RWTH Aachen University', 'Computer Science', 'Germany', 'https://images.pexels.com/photos/11932106/pexels-photo-11932106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 300 seats for CS.', '10+2 with strong academics, German proficiency.', 'No tuition fee; semester fee EUR 300.', 'Student dorms with shared kitchens; Aachen rentals.', 75, 1),
('All India Institute of Medical Sciences, Delhi', 'MBBS', 'India', 'https://images.pexels.com/photos/19554793/pexels-photo-19554793.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 125 seats through NEET-UG.', '10+2 with Physics, Chemistry, Biology and valid NEET rank.', 'Approx INR 6,000 per year (subsidised).', 'Hostels with mess on campus; PG options in Ansari Nagar.', 85, 1),
('Christian Medical College, Vellore', 'MBBS', 'India', 'https://images.pexels.com/photos/37328679/pexels-photo-37328679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 100 seats through NEET-UG.', '10+2 with Physics, Chemistry, Biology and valid NEET rank.', 'Approx INR 3 lakh per year.', 'Hostels with mess on campus; PG options in Vellore.', 80, 2),
('Armed Forces Medical College, Pune', 'MBBS', 'India', 'https://images.pexels.com/photos/35314982/pexels-photo-35314982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 150 seats through NEET-UG.', '10+2 with Physics, Chemistry, Biology and valid NEET rank.', 'Approx INR 70,000 per year.', 'Cadet hostels with mess on campus; limited PG nearby.', 78, 3),
('Johns Hopkins University', 'MBBS', 'United States', 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 120 seats per cohort.', 'Bachelor''s degree, MCAT, essays, interview.', 'Approx USD 60,000 per year.', 'On-campus housing with dining; Baltimore apartments.', 90, 1),
('University of Oxford', 'MBBS', 'United Kingdom', 'https://images.pexels.com/photos/39345684/pexels-photo-39345684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 150 seats per cohort.', 'A-levels with Chemistry and Biology, BMAT, interview.', 'Approx GBP 40,000 per year.', 'College accommodation with dining; Oxford rentals.', 88, 1),
('University of Melbourne', 'MBBS', 'Australia', 'https://images.pexels.com/photos/39289023/pexels-photo-39289023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 300 seats per cohort.', 'Bachelor''s degree, GAMSAT, interview.', 'Approx AUD 90,000 per year.', 'On-campus housing with dining; Melbourne apartments.', 82, 1),
('National Law School of India University, Bangalore', 'Law', 'India', 'https://images.pexels.com/photos/2566121/pexels-photo-2566121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 80 seats through CLAT.', '10+2 with 45% marks and valid CLAT rank.', 'Approx INR 14 lakh for the 5-year programme.', 'Hostels with mess on campus; PG options in Nagarbhavi.', 80, 1),
('NALSAR University of Law, Hyderabad', 'Law', 'India', 'https://images.pexels.com/photos/36899861/pexels-photo-36899861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 130 seats through CLAT.', '10+2 with 45% marks and valid CLAT rank.', 'Approx INR 12 lakh for the 5-year programme.', 'Hostels with mess on campus; PG options in Shameerpet.', 78, 2),
('Faculty of Law, University of Delhi', 'Law', 'India', 'https://images.pexels.com/photos/20200756/pexels-photo-20200756.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 2500 seats across 3-year LLB.', 'Bachelor''s degree with 50% marks and valid DUET score.', 'Approx INR 2 lakh for the 3-year programme.', 'University hostels with mess; PG options in North Campus.', 70, 3),
('Yale Law School', 'Law', 'United States', 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 200 seats per cohort.', 'Bachelor''s degree, LSAT, essays, interview.', 'Approx USD 70,000 per year.', 'On-campus housing with dining; New Haven apartments.', 92, 1),
('Harvard Law School', 'Law', 'United States', 'https://images.pexels.com/photos/30719244/pexels-photo-30719244.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 560 seats per cohort.', 'Bachelor''s degree, LSAT, essays, interview.', 'Approx USD 68,000 per year.', 'On-campus housing with dining; Cambridge apartments.', 90, 2),
('University of Cambridge', 'Law', 'United Kingdom', 'https://images.pexels.com/photos/29704450/pexels-photo-29704450.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Around 200 seats per cohort.', 'A-levels with strong grades, admissions test, interview.', 'Approx GBP 26,000 per year.', 'College accommodation with dining; Cambridge rentals.', 88, 1)
ON CONFLICT DO NOTHING;
