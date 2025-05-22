import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
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

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },
  register: (name: string, email: string, password: string) => {
    return apiClient.post('/auth/register', { name, email, password });
  },
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Workflows API
export const workflowsAPI = {
  getAll: (params?: any) => {
    return apiClient.get('/workflows', { params });
  },
  getById: (id: number) => {
    return apiClient.get(`/workflows/${id}`);
  },
  create: (data: any) => {
    return apiClient.post('/workflows', data);
  },
  update: (id: number, data: any) => {
    return apiClient.put(`/workflows/${id}`, data);
  },
  delete: (id: number) => {
    return apiClient.delete(`/workflows/${id}`);
  },
  getVersions: (id: number) => {
    return apiClient.get(`/workflows/${id}/versions`);
  },
  execute: (id: number) => {
    return apiClient.post(`/workflows/${id}/execute`);
  },
};

// Executions API
export const executionsAPI = {
  getAll: (params?: any) => {
    return apiClient.get('/executions', { params });
  },
  getById: (id: number) => {
    return apiClient.get(`/executions/${id}`);
  },
  getLogs: (id: number) => {
    return apiClient.get(`/executions/${id}/logs`);
  },
};

// Nodes API
export const nodesAPI = {
  getAll: (params?: any) => {
    return apiClient.get('/nodes', { params });
  },
  getCategories: () => {
    return apiClient.get('/nodes/categories');
  },
};

// AI API
export const aiAPI = {
  getModels: (type?: string) => {
    return apiClient.get('/ai/models', { params: { type } });
  },
  processLLM: (data: any) => {
    return apiClient.post('/ai/llm/process', data);
  },
  processAgent: (data: any) => {
    return apiClient.post('/ai/agent/process', data);
  },
  generateContent: (data: any) => {
    return apiClient.post('/ai/content/generate', data);
  },
  suggestWorkflow: (prompt: string) => {
    return apiClient.post('/ai/workflow/suggest', { prompt });
  },
};

// Templates API
export const templatesAPI = {
  getAll: (params?: any) => {
    return apiClient.get('/templates', { params });
  },
  getById: (id: number) => {
    return apiClient.get(`/templates/${id}`);
  },
  use: (id: number) => {
    return apiClient.post(`/templates/${id}/use`);
  },
};

// Triggers API
export const triggersAPI = {
  getWebhooks: (params?: any) => {
    return apiClient.get('/triggers/webhooks', { params });
  },
  createWebhook: (data: any) => {
    return apiClient.post('/triggers/webhooks', data);
  },
  getSchedules: (params?: any) => {
    return apiClient.get('/triggers/schedules', { params });
  },
  createSchedule: (data: any) => {
    return apiClient.post('/triggers/schedules', data);
  },
};

export default apiClient;
