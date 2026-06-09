export type Category = 'Todos' | 'Corrida' | 'Futebol' | 'Academia' | 'Ciclismo';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  emoji: string;
  rating: number;
  reviewCount: number;
  description: string;
  sizes: number[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: number;
}

export type OrderStatus = 'Entregue' | 'A caminho' | 'Processando' | 'Cancelado';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: { emoji: string; name: string }[];
  total: number;
  itemCount: number;
}

export interface DeliveryAddress {
  label: string;
  recipient: string;
  street: string;
  city: string;
}

export type DeliveryMethod = 'express' | 'standard';
export type PaymentMethod = 'credit' | 'pix' | 'boleto';
