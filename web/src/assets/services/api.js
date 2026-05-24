import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000/api/v1/',
});

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
