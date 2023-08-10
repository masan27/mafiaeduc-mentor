import axios from 'axios';

const ENV = import.meta.env.MODE;
const LOCAL_URL = import.meta.env.VITE_API_LOCAL_URL;
const PROD_URL = import.meta.env.VITE_API_PROD_URL;

const BASE_URL = ENV === 'development' ? LOCAL_URL : PROD_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.set('X-Mentor-Token', token);
    }
    return config;
});

export default api;
