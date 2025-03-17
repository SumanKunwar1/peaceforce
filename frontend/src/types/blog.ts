export interface Author {
  name: string;
  avatar: string | File;
  role: string;
}

export interface BlogPost {
  id?: string;
  isEditable?: boolean;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  image: string | File;
  category: string;
  tags: string[];
  readTime: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}
