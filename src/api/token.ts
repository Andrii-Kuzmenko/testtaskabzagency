import { Token } from '../types/Token';
import { client } from '../utils/axiosClient';

export const getToken = () => {
  return client.get<Token>(`/token`);
};