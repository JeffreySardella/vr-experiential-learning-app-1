export interface Institution {
    id: number;
    name: string;
    datetime_created: string;
  }

export interface Program {
    id: number;
    name: string;
  }

export interface Course {
    id: number;
    name: string;
  }

export interface Subject {
  id: number;
  name: string;
  description: string;
  video: string;
}
