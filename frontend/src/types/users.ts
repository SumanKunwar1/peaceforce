export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  address?: string;
  page?: string;
  pageTitle?: string;
  role?: string;
  cv?: string;
  jobPostId?: string;
  coverLetter?: string;
}
