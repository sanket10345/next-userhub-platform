import axios from 'axios';

// Choose base URL based on environment (server or client)
const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? process.env.API_INTERNAL_URL || 'http://localhost:4000'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: `${baseURL}/user`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `[Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`,
      config.data || ''
    );
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Response]`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[Response Error]', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

// CRUD API Functions
export const fetchUsers = async () => {
  const res = await apiClient.get('/');
  return res.data;
};

export const fetchUserById = async (id) => {
  const res = await apiClient.get(`/${id}`);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await apiClient.post('/', userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await apiClient.put(`/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await apiClient.delete(`/${id}`);
  return res.data;
};
