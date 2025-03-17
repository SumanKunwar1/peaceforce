export interface ISeoMetaInput {
  pageTitle: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  robotsMeta?: string;

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface ISeoMetaUpdate {
  pageTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  robotsMeta?: string;

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}
