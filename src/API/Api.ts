import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';


const getBaseURL = () => {
    return "http://localhost:8000/api/";
  };

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: getBaseURL(),

  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false; // This should be a boolean, not an object
let failedQueue: FailedRequest[] = []; // Correctly typed as an array of FailedRequest objects

// Process the queue of failed requests
const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((request) => {
    if (token) {
      request.resolve(token);
    } else {
      request.reject(error);
    }
  });
  failedQueue = [];
};

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = "";
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh process to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh the token
        const response = await axios.post<RefreshTokenResponse>('https://api.example.com/auth/refresh', {
          // refreshToken: Cookies.get('refreshToken'),
        });

        const { accessToken} = response.data;

        // // Store new tokens
        // Cookies.set('token', accessToken);
        // Cookies.set('refreshToken', refreshToken);

        // Process the failed requests
        processQueue(null, accessToken);

        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
