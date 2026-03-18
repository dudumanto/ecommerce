import axios from 'axios';

// Use a porta do Docker (8080) em vez da 8000
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // ALTERADO PARA 8080
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;