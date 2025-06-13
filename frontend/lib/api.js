import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições autenticadas
api.interceptors.request.use((config) => {
  // Garante que o código só rode no lado do cliente (navegador)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('adrenalina_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;