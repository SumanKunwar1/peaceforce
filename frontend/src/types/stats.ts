export interface Stat {
  _id: string;
  id: string;
  icon: string;
  endValue: number;
  label: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStatsInput {
  icon?: string;
  endValue?: number;
  label?: string;
  description?: string;
}
