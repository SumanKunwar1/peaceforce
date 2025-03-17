export interface IAboutContentInput {
  title: string;
  description: string;
  icon?: string;
}

export interface IAboutHeroContentInput {
  title: string;
  description: string;
}

export interface IAboutInput {
  aboutHero: IAboutHeroContentInput;
  aboutContent: IAboutContentInput[];
  missionsSection: IAboutContentInput[];
  servicesSection: IAboutContentInput[];
  visionSection: IAboutContentInput[];
  image?: File | string;
}

export interface IAbout extends IAboutInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
