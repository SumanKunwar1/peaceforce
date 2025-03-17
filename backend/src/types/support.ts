export interface ISupportInput {
  hero?: {
    title?: string;
    subtitle?: string;
    image?: string;
  };
  impacts?: {
    icon?: string;
    number?: string;
    title?: string;
    description?: string;
  }[];
  waysToSupport?: {
    icon?: string;
    title?: string;
    description?: string;
    fullDescription?: string;
    benefits?: string[];
  }[];
}
