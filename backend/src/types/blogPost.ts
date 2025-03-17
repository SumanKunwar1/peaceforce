export interface IBlogPostInput {
  isEditable?: boolean;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: {
    name?: string;
    avatar?: string;
    role?: string;
  };
  image?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
