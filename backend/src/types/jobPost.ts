export interface IJobPostInput {
  title?: string;
  department?: string;
  location?: string;
  type?: "Full-time" | "Part-time" | "Contract";
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  postedDate?: string;
  deadline?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
