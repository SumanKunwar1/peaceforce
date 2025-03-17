export interface IpageInput {
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

export interface IpageUpdate {
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
