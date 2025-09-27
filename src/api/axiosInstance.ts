import axios from 'axios';
// import localStorageStore from '../store/localStorageStore';

export const backendApi = import.meta.env.VITE_APP_ENDPOINT || 'https://app.mivips.com/api';

// Simple axios instance for API calls
const axiosInstance = axios.create({
  baseURL: backendApi,
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Include cookies in CORS requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionStart');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Legacy function for backward compatibility
export function createAxiosInstance(history: any = null, passedHeaders: any = null) {
  let headers: Record<string, any> = passedHeaders ? passedHeaders : {};

  if (localStorage.getItem('token')) {
    headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  const entityId = localStorage.getItem('selectedEntity');
  if (entityId) {
    headers.entity = entityId;
  }

  const instance = axios.create({
    baseURL: backendApi,
    headers,
  });

  function clearTokenAndRedirectToHome() {
    // localStorageStore.logout();
    if (history) {
      history.push('/');
    } else {
      //@ts-ignore
      window.location = '/';
    }
  }

  instance.interceptors.response.use(
    response => response,
    async error => {
      if (
        error.request?.responseType === 'blob' &&
        error.response?.data?.type?.toLowerCase().includes('json')
      ) {
        return new Promise(async (_, reject) => {
          const text = await error.response.data.text();
          const err = JSON.parse(text);
          reject({ open: true, type: 'error', message: err.error });
        });
      }

      if (error.message === 'Network Error') {
        return new Promise((_, reject) => {
          reject({ open: true, type: 'error', status: error?.response?.status });
        });
      }

      if (!error.response) {
        return new Promise((_, reject) => {
          reject({
            open: true,
            type: 'error',
            message: error.message || 'Something went wrong',
            status: error?.response?.status,
          });
        });
      }

      if (error.response.status === 401) {
        clearTokenAndRedirectToHome();
        return Promise.reject({
          open: true,
          type: 'error',
          message: error.response.data.message || 'Unauthorized access.',
          status: error.response.status,
        });
      }

      return Promise.reject({
        open: true,
        type: 'error',
        message:
          error.response.data.error || error.response.data.message || 'Something went wrong.',
      });
    }
  );

  return instance;
}
