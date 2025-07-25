import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const attachInterceptors = (logoutFn, getToken) => {
  axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data?.message?.toLowerCase().includes("token")
      ) {
        logoutFn(); // 🔐 Auto logout on token error
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
