import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
    withCredentials: true, // Important for cookies
});

// console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Extend AxiosRequestConfig to support custom _retry field
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

// Intercept responses
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // If access token expired and this is not a refresh request already
        if (
            error.response?.status === 401 
            && !originalRequest._retry
            && !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await api.post('/auth/refresh', {}, { withCredentials: true });
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Redirect to login or return error
                console.error('Refresh token failed', refreshError);
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    } 
);

export default api;