export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  category: string;
  stock_quantity: number;
  created_at: string;
}

export interface ItemWithReviews extends Item {
  reviews: Review[];
  average_rating?: number;
  review_count: number;
}

export interface Review {
  id: number;
  user_id: number;
  item_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user_name: string;
  // Optionally, user_initial?: string;
}

export interface Order {
  id: number;
  user_id: number;
  item_id: number;
  service_type: 'delivery' | 'in_person';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  quantity: number;
  total_price: number;
  delivery_address?: string;
  scheduled_time?: string;
  mobile_number?: string;
  cancellation_reason?: string;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  item: Item;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 