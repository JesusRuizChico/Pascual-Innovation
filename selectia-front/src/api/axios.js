// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true 
});

// INTERCEPTOR: Se ejecuta antes de cada petición
instance.interceptors.request.use((config) => {
    // 1. Buscar el token en el almacenamiento local
    const token = localStorage.getItem('token');
    
    // 2. Si existe, agregarlo al header 'x-auth-token'
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;