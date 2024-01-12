import { ServerPositionsData } from '../types/Position';
import { client } from '../utils/axiosClient';

export const getPositions = () => { 
  return client.get<ServerPositionsData>('/positions');
};

