import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/user',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add token if using auth
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
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
    console.log(`[Response]`, response);
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
