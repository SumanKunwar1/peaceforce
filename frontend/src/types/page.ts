export interface IPageData {
  _id: string;
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  lastUpdated: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPageInput {
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

export interface IPageUpdate {
  title?: string;
  slug?: string;
  location?: "header" | "footer";
  parentPage?: string;
  content?: string;
  status?: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}
