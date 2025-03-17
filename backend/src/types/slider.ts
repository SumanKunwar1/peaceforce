export interface ISliderInput {
  title?: string;
  description?: string;
  image: string;
  isVisible?: boolean;
  buttons?: {
    text: string;
    link: string;
    bgColor: string;
  }[];
}
