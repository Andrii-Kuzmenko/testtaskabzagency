import { client } from '../utils/axiosClient';
import { ServerData, User } from '../types/User';

export const getUsers = (page: number, count: number) => { 
  return client.get<ServerData>('users', page, count);
};

export const getUser = (userId: string) => {
  return client.get<User>(`/users/${userId}`);
};

export const postUser = (data: FormData, access_token: string) => {
  return client.post<FormData>('/users', data, access_token);
};