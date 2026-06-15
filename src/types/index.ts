// ─── Product (from API) ──────────────────────────────────────────────────────

export interface Product {
  _id?: string | null;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  categorySlug: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt?: string;
}

// ─── Category (from API) ────────────────────────────────────────────────────

export interface Category {
  _id?: string | null;
  slug: string;
  name: string;
  description: string;
  active: boolean;
  created_at?: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderItem {
  productSku: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  _id?: string | null;
  code: string;
  userCode: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentCode: string;
  createdAt?: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  name: string;
  email: string;
  code?: string;
}

// ─── Checkout helpers ────────────────────────────────────────────────────────

export interface DeliveryAddress {
  label: string;
  recipient: string;
  street: string;
  city: string;
}

export type DeliveryMethod = 'express' | 'standard';
export type PaymentMethod = 'credit' | 'pix' | 'boleto';
