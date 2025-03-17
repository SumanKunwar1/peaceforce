export interface Testimonial {
  _id: string;
  id: string;
  quote?: string;
  author?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestimonialInput {
  quote?: string;
  author?: string;
  role?: string;
}
