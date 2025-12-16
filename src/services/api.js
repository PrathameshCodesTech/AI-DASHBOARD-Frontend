import axios from 'axios';

const API_BASE_URL = 'https://dashboard.vibecopilot.ai/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session authentication
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth token here if using token-based auth
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please login');
    }
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const getDashboardMetrics = async () => {
  try {
    const response = await api.get('/dashboard/metrics/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Chat APIs
export const sendChatMessage = async (message, conversationId = null) => {
  try {
    const response = await api.post('/chat/', {
      message,
      conversation_id: conversationId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatHistory = async (conversationId) => {
  try {
    const response = await api.get(`/chat/history/${conversationId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearChatHistory = async (conversationId) => {
  try {
    const response = await api.delete(`/chat/history/${conversationId}/clear/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatSuggestions = async () => {
  try {
    const response = await api.get('/chat/suggestions/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic CRUD APIs (if needed)
export const getProperties = async (params = {}) => {
  try {
    const response = await api.get('/properties/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTenants = async (params = {}) => {
  try {
    const response = await api.get('/tenants/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTickets = async (params = {}) => {
  try {
    const response = await api.get('/tickets/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjects = async (params = {}) => {
  try {
    const response = await api.get('/projects/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;