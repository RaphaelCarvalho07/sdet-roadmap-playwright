export interface UserPayload {
  name: string;
  job: string;
}

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface IApiUser {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: IUser[];
}