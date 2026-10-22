export type College = {
  id: string;
  name: string;
  course: string;
  country: string;
  image_url: string;
  intake: string;
  eligibility: string;
  fee_structure: string;
  hostel_mess: string;
  min_score: number;
  ranking: number | null;
  website_url: string | null;
  created_at: string;
};

export type StudentForm = {
  name: string;
  score: string;
  course: string;
  country: string;
};
