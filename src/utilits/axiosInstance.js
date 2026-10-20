import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - Add JWT token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('lumora-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('lumora-token');
            window.location.href = '/login';
        }

        // Handle 403 Forbidden - Insufficient permissions
        if (error.response && error.response.status === 403) {
            console.error('Access forbidden');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;