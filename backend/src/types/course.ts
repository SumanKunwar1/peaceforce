export interface IInstructorInput {
  name?: string;
  title?: string;
  bio?: string;
  image?: string;
}

export interface ICourseInput {
  title?: string;
  description?: string;
  image?: string;
  duration?: string;
  language?: string[];
  instructor?: IInstructorInput;
  highlights?: string[];
  materials?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
