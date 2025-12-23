// API Service Layer - Based on Postman Collection
// Base URL: https://bjbdhybbxhjrjxiornqa.supabase.co

const BASE_URL = 'https://bjbdhybbxhjrjxiornqa.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmRoeWJieGhqcmp4aW9ybnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzI0NTUsImV4cCI6MjA2NDcwODQ1NX0.sTJpP4rYPfzUfLbSGIyiDZ3lRJkwkxgLMHrq4-bD53M';

// Types
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    role?: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  customer_type: 'individual' | 'business';
  gstin?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  category_id: string;
  vehicle_number: string;
  make?: string;
  model?: string;
  year?: number;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  category?: Category;
}

export interface Service {
  id: string;
  category_id: string;
  code: string;
  name: string;
  description?: string;
  base_price: number;
  display_order: number;
  created_at: string;
  category?: Category;
}

export interface ServiceRecordService {
  service_id: string;
  price: number;
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  customer_id: string;
  vehicle_id: string;
  service_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  paid_amount: number;
  notes?: string;
  services: ServiceRecordService[];
  created_at: string;
  updated_at: string;
  customer?: Customer;
  vehicle?: Vehicle;
}

export interface Payment {
  id: string;
  service_record_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer';
  payment_date: string;
  transaction_id?: string;
  notes?: string;
  created_at: string;
  service_record?: ServiceRecord;
}

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  totalCategories: number;
  totalServices: number;
  individualCustomers: number;
  businessCustomers: number;
  pendingServices: number;
  completedServices: number;
  totalRevenue: number;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: T | T[] | boolean | string | number | undefined;
}

// Helper function to get auth headers
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'apikey': ANON_KEY,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; access_token: string }> {
    const response = await fetch(`${BASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse<{ user: User; access_token: string }>(response);
    return data;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetch(`${BASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  async getUser(): Promise<User | null> {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
      const response = await fetch(`${BASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },
};

// Customers API
export const customersApi = {
  async list(params?: { limit?: number; offset?: number; search?: string }): Promise<{ customers: Customer[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const response = await fetch(`${BASE_URL}/functions/v1/customers?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async get(id: string): Promise<Customer> {
    const response = await fetch(`${BASE_URL}/functions/v1/customers?id=${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<Customer>>(response);
    return data.customer as Customer;
  },

  async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const response = await fetch(`${BASE_URL}/functions/v1/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(customer),
    });
    const data = await handleResponse<ApiResponse<Customer>>(response);
    return data.customer as Customer;
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${BASE_URL}/functions/v1/customers?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(customer),
    });
    const data = await handleResponse<ApiResponse<Customer>>(response);
    return data.customer as Customer;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/functions/v1/customers?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};

// Categories API
export const categoriesApi = {
  async list(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/functions/v1/categories`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<Category[]>>(response);
    return (data.categories || []) as Category[];
  },

  async get(id: string): Promise<Category> {
    const response = await fetch(`${BASE_URL}/functions/v1/categories?id=${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<Category>>(response);
    return data.category as Category;
  },

  async create(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const response = await fetch(`${BASE_URL}/functions/v1/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    const data = await handleResponse<ApiResponse<Category>>(response);
    return data.category as Category;
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${BASE_URL}/functions/v1/categories?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    const data = await handleResponse<ApiResponse<Category>>(response);
    return data.category as Category;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/functions/v1/categories?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};

// Vehicles API
export const vehiclesApi = {
  async list(params?: { limit?: number; offset?: number; customer_id?: string }): Promise<{ vehicles: Vehicle[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.customer_id) searchParams.set('customer_id', params.customer_id);
    
    const response = await fetch(`${BASE_URL}/functions/v1/vehicles?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async get(id: string): Promise<Vehicle> {
    const response = await fetch(`${BASE_URL}/functions/v1/vehicles?id=${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<Vehicle>>(response);
    return data.vehicle as Vehicle;
  },

  async create(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'customer' | 'category'>): Promise<Vehicle> {
    const response = await fetch(`${BASE_URL}/functions/v1/vehicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vehicle),
    });
    const data = await handleResponse<ApiResponse<Vehicle>>(response);
    return data.vehicle as Vehicle;
  },

  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const response = await fetch(`${BASE_URL}/functions/v1/vehicles?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(vehicle),
    });
    const data = await handleResponse<ApiResponse<Vehicle>>(response);
    return data.vehicle as Vehicle;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/functions/v1/vehicles?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};

// Services API
export const servicesApi = {
  async list(params?: { limit?: number; category_id?: string }): Promise<{ services: Service[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category_id) searchParams.set('category_id', params.category_id);
    
    const response = await fetch(`${BASE_URL}/functions/v1/services?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async get(id: string): Promise<Service> {
    const response = await fetch(`${BASE_URL}/functions/v1/services?id=${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<Service>>(response);
    return data.service as Service;
  },

  async create(service: Omit<Service, 'id' | 'created_at' | 'category'>): Promise<Service> {
    const response = await fetch(`${BASE_URL}/functions/v1/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(service),
    });
    const data = await handleResponse<ApiResponse<Service>>(response);
    return data.service as Service;
  },

  async update(id: string, service: Partial<Service>): Promise<Service> {
    const response = await fetch(`${BASE_URL}/functions/v1/services?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(service),
    });
    const data = await handleResponse<ApiResponse<Service>>(response);
    return data.service as Service;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/functions/v1/services?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};

// Service Records API
export const serviceRecordsApi = {
  async list(params?: { limit?: number; offset?: number; customer_id?: string; vehicle_id?: string }): Promise<{ service_records: ServiceRecord[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.customer_id) searchParams.set('customer_id', params.customer_id);
    if (params?.vehicle_id) searchParams.set('vehicle_id', params.vehicle_id);
    
    const response = await fetch(`${BASE_URL}/functions/v1/service-records?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async get(id: string): Promise<ServiceRecord> {
    const response = await fetch(`${BASE_URL}/functions/v1/service-records?id=${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<ServiceRecord>>(response);
    return data.service_record as ServiceRecord;
  },

  async create(record: Omit<ServiceRecord, 'id' | 'created_at' | 'updated_at' | 'customer' | 'vehicle'>): Promise<ServiceRecord> {
    const response = await fetch(`${BASE_URL}/functions/v1/service-records`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(record),
    });
    const data = await handleResponse<ApiResponse<ServiceRecord>>(response);
    return data.service_record as ServiceRecord;
  },

  async update(id: string, record: Partial<ServiceRecord>): Promise<ServiceRecord> {
    const response = await fetch(`${BASE_URL}/functions/v1/service-records?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(record),
    });
    const data = await handleResponse<ApiResponse<ServiceRecord>>(response);
    return data.service_record as ServiceRecord;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/functions/v1/service-records?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};

// Payments API
export const paymentsApi = {
  async list(params?: { limit?: number; service_record_id?: string }): Promise<{ payments: Payment[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.service_record_id) searchParams.set('service_record_id', params.service_record_id);
    
    const response = await fetch(`${BASE_URL}/functions/v1/payments?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async get(id: string): Promise<Payment> {
    const response = await fetch(`${BASE_URL}/functions/v1/payments?id=${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<ApiResponse<Payment>>(response);
    return data.payment as Payment;
  },

  async create(payment: Omit<Payment, 'id' | 'created_at' | 'service_record'>): Promise<Payment> {
    const response = await fetch(`${BASE_URL}/functions/v1/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payment),
    });
    const data = await handleResponse<ApiResponse<Payment>>(response);
    return data.payment as Payment;
  },

  async update(id: string, payment: Partial<Payment>): Promise<Payment> {
    const response = await fetch(`${BASE_URL}/functions/v1/payments?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payment),
    });
    const data = await handleResponse<ApiResponse<Payment>>(response);
    return data.payment as Payment;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/functions/v1/payments?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};

// Reports API
export const reportsApi = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await fetch(`${BASE_URL}/functions/v1/reports/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getRevenue(params?: { period?: string; start_date?: string; end_date?: string }): Promise<{ revenue: number[]; labels: string[] }> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.start_date) searchParams.set('start_date', params.start_date);
    if (params?.end_date) searchParams.set('end_date', params.end_date);
    
    const response = await fetch(`${BASE_URL}/functions/v1/reports/revenue?${searchParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
