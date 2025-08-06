import axios from 'axios';
import { 
  User, 
  Item, 
  ItemWithReviews, 
  Review, 
  Order, 
  OrderWithDetails,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ReviewWithUser
} from '../types';

//const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://withus-project.onrender.com/api';
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add global response interceptor for auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login?expired=1';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Items API
export const itemsAPI = {
  getAll: async (category?: string): Promise<Item[]> => {
    const params = category ? { category } : {};
    const response = await api.get('/items', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ItemWithReviews> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/items/categories/list');
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  create: async (review: Omit<Review, 'id' | 'user_id' | 'created_at'>): Promise<Review> => {
    const response = await api.post('/reviews', review);
    return response.data;
  },

  getByItemId: async (itemId: number): Promise<Review[]> => {
    const response = await api.get(`/reviews/item/${itemId}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<Review[]> => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  getAll: async (): Promise<ReviewWithUser[]> => {
    const response = await api.get('/reviews/all');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (order: Omit<Order, 'id' | 'user_id' | 'status' | 'total_price' | 'created_at'>): Promise<Order> => {
    const response = await api.post('/orders', order);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<OrderWithDetails[]> => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  getById: async (orderId: number): Promise<OrderWithDetails> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders/all', { params: {} }); // Fix for FastAPI 422 error
    return response.data;
  },

  updateStatus: async (orderId: number, status: string, cancellation_reason?: string): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/status`, null, {
      params: { status, cancellation_reason },
    });
    return response.data;
  },
};

export default api; 