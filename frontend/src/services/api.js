/**
 * API Service
 * Centralized axios instance with auth token injection
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Inject JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired — clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Attempts ─────────────────────────────────────────────────────────────────
export const attemptService = {
  submit: (data) => api.post('/attempts/submit', data),
  getUserAttempts: (userId, page = 1, limit = 10) =>
    api.get(`/attempts/user/${userId}?page=${page}&limit=${limit}`),
  getAttemptById: (id) => api.get(`/attempts/${id}`),
  getDashboard: (userId) => api.get(`/attempts/dashboard/${userId}`),
};

export default api;
