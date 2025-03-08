import { store } from '@/app/store';
import axios from 'axios';
import { setIsAuthenticated } from './auth/authSlice';

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
});

request.interceptors.request.use(
    config => {
        if (store.getState().auth.token) {
            config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

request.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            if (error.response.status === 404) {
                console.error('Resource not found');
            }
            if (error.response.status === 401) {
                store.dispatch(setIsAuthenticated(false));
                console.error('Resource 401');
            }
            if (error.response.status === 403) {
                console.error('Resource 403');
            }
        }
        return Promise.reject(error);
    }
);

export default request;
