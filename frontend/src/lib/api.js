import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const submissionAPI = {
  create: (data) => api.post('/submissions', data),
  getAll: () => api.get('/submissions'),
  getById: (id) => api.get(`/submissions/${id}`),
  generateScore: (id) => api.post(`/submissions/${id}/generate-score`),
  getScore: (id) => api.get(`/submissions/${id}/score`),
  getBlueprint: (id) => api.get(`/submissions/${id}/blueprint`),
};

export const blueprintRequestAPI = {
  create: (data) => api.post('/blueprint-requests', data),
};

export const adminAPI = {
  getSubmissions: () => api.get('/admin/submissions'),
  getUsers: () => api.get('/admin/users'),
  updateScore: (submissionId, data) => api.put(`/admin/scores/${submissionId}`, data),
  addExpertNote: (data) => api.post('/admin/expert-notes', data),
  updateCredits: (userId, data) => api.put(`/admin/users/${userId}/credits`, data),
  updateSubmissionStatus: (submissionId, status) => 
    api.put(`/admin/submissions/${submissionId}/status?status=${status}`),
  getBlueprintRequests: () => api.get('/admin/blueprint-requests'),
  getCreditLogs: () => api.get('/admin/credit-logs'),
};

export default api;
