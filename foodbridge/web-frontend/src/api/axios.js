import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
const BASE_URL = VITE_API_BASE_URL.endsWith('/api')
    ? VITE_API_BASE_URL.slice(0, -4)
    : VITE_API_BASE_URL.replace(/\/api\/$/, '');

const api = axios.create({
    baseURL: VITE_API_BASE_URL,
});

const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (path.startsWith('http')) return path;
    // Ensure path has leading slash if it doesn't
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${normalizedPath}`;
};

export { BASE_URL, getImageUrl };

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
