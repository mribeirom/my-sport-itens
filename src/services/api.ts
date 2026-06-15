import { Product, Category, Order, OrderItem } from '../types';
import { DeviceEventEmitter, Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://mysportitens-api.vercel.app';

// ─── Raw API response types (with optional fields) ──────────────────────────

interface ApiProduct {
  _id?: string | null;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  categorySlug: string;
  price: number;
  stock?: number;
  active?: boolean;
  createdAt?: string;
}

interface ApiCategory {
  _id?: string | null;
  slug: string;
  name: string;
  description: string;
  active?: boolean;
  created_at?: string;
}

interface ApiOrder {
  _id?: string | null;
  code: string;
  userCode: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  paymentCode: string;
  createdAt?: string;
}

export interface ApiCartItem {
  productSku: string;
  quantity: number;
}

export interface ApiCart {
  _id?: string | null;
  userCode: string;
  items: ApiCartItem[];
  updatedAt?: string;
}

interface ApiUserCreate {
  name: string;
  email: string;
  password: string;
}

interface ApiUserLogin {
  email: string;
  password: string;
}

// ─── HTTP Helper ─────────────────────────────────────────────────────────────

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: any = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  try {
    const token = await AsyncStorage.getItem('@mysportitens:token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore async storage errors
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    DeviceEventEmitter.emit('onTokenExpired');
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Erro ${response.status}`);
  }

  return response.json();
}

// ─── Mappers (API → App types) ───────────────────────────────────────────────

function mapProduct(p: ApiProduct): Product {
  return {
    _id: p._id,
    sku: p.sku,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    categorySlug: p.categorySlug,
    price: p.price,
    stock: p.stock ?? 0,
    active: p.active ?? true,
    createdAt: p.createdAt,
  };
}

function mapCategory(c: ApiCategory): Category {
  return {
    _id: c._id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    active: c.active ?? true,
    created_at: c.created_at,
  };
}

function mapOrder(o: ApiOrder): Order {
  return {
    _id: o._id,
    code: o.code,
    userCode: o.userCode,
    items: o.items,
    totalAmount: o.totalAmount,
    status: o.status ?? 'paid',
    paymentCode: o.paymentCode,
    createdAt: o.createdAt,
  };
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const raw = await request<ApiProduct[]>('/api/products/');
  return raw.map(mapProduct);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const raw = await request<ApiCategory[]>('/api/categories/');
  return raw.map(mapCategory);
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function registerUser(data: ApiUserCreate): Promise<any> {
  return request('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: ApiUserLogin): Promise<any> {
  return request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function fetchCart(userCode: string): Promise<ApiCart> {
  return request<ApiCart>(`/api/carts/${encodeURIComponent(userCode)}`);
}

export async function upsertCart(cart: ApiCart): Promise<any> {
  return request('/api/carts/', {
    method: 'POST',
    body: JSON.stringify(cart),
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function fetchOrders(userCode: string): Promise<Order[]> {
  const raw = await request<ApiOrder[]>(`/api/orders/${encodeURIComponent(userCode)}`);
  return raw.map(mapOrder);
}

export async function createOrder(order: Order): Promise<any> {
  return request('/api/orders/', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}
