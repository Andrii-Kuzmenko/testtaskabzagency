import axios from 'axios';

export const BASE_URL = 'https://frontend-test-assignment-api.abz.agency/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
});

const addAccessToken = (accessToken: string) => {
  instance.defaults.headers.common['token'] = `${accessToken}`;
};

export const client = {
  async get<T>(url: string, page?: number, count?: number) {
    const params: Record<string, unknown> = {
      page: page,
      count: count,
    };

    const response = await instance.get<T>(url, { params });

    return response.data;
  },

  async post<T>(url: string, data: unknown, accessToken: string) {
    if (accessToken) {
      addAccessToken(accessToken);
    }
    
    const response = await instance.post<T>(url, data);

    return response;
  },
};



