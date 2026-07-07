import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const objetosUrl = import.meta.env.VITE_OBJETOS_URL;

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@EducaRA:token');

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        };

        config.headers.Accept = 'application/json';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

