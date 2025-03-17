export interface IAboutContentInput {
  title?: string;
  description?: string;
  icon?: string;
}

export interface IAboutHeroContentInput {
  title?: string;
  description?: string;
}

export interface IAboutInput {
  image?: string;
  aboutHero?: IAboutHeroContentInput;
  aboutContent?: IAboutContentInput[];
  missionsSection?: IAboutContentInput[];
  servicesSection?: IAboutContentInput[];
  visionSection?: IAboutContentInput[];
}
