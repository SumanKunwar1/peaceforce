export interface ICourse {
  _id?: string;
  id: string;
  title: string;
  description: string;
  image: File | string | null;
  duration: string;
  language: string[];
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: File | string | null;
  };
  highlights: string[];
  materials: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface EnrollmentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  page: string;
  pageTitle: string;
  address: string;
  preferredLanguage: string;
  message?: string;
  courseId: string;
}
