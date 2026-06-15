import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { fetchCart, upsertCart } from '../services/api';

interface CartContextData {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productSku: string) => void;
  updateQuantity: (productSku: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Expose a way to set products for resolving cart items from API
  // We'll load products in the home screen and store them here
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());

  // Sync products map when allProducts changes
  useEffect(() => {
    const map = new Map<string, Product>();
    allProducts.forEach((p) => map.set(p.sku, p));
    setProductsMap(map);
  }, [allProducts]);

  // Load cart from API when user is available
  useEffect(() => {
    if (!user?.code) return;

    async function loadCart() {
      try {
        setIsLoading(true);
        const apiCart = await fetchCart(user!.code!);
        if (apiCart && apiCart.items && apiCart.items.length > 0) {
          // We need product details to rebuild CartItems
          // For now store the raw items, they'll be resolved when products are loaded
          const { fetchProducts } = await import('../services/api');
          const products = await fetchProducts();
          const pMap = new Map<string, Product>();
          products.forEach((p: Product) => pMap.set(p.sku, p));
          setProductsMap(pMap);
          setAllProducts(products);

          const resolved: CartItem[] = [];
          for (const apiItem of apiCart.items) {
            const product = pMap.get(apiItem.productSku);
            if (product) {
              resolved.push({ product, quantity: apiItem.quantity });
            }
          }
          setItems(resolved);
        }
      } catch (e) {
        // Cart might not exist yet, that's OK
        console.log('Carrinho não encontrado ou vazio');
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, [user?.code]);

  // Sync cart to API whenever items change
  const syncCart = useCallback(
    async (newItems: CartItem[]) => {
      if (!user?.code) return;
      try {
        await upsertCart({
          userCode: user.code,
          items: newItems.map((i) => ({
            productSku: i.product.sku,
            quantity: i.quantity,
          })),
        });
      } catch (e) {
        console.error('Erro ao sincronizar carrinho:', e);
      }
    },
    [user?.code]
  );

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.sku === product.sku);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map((i) =>
          i.product.sku === product.sku
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prev, { product, quantity: 1 }];
      }
      syncCart(newItems);
      return newItems;
    });
  };

  const removeItem = (productSku: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.product.sku !== productSku);
      syncCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productSku: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productSku);
      return;
    }
    setItems((prev) => {
      const newItems = prev.map((i) =>
        i.product.sku === productSku ? { ...i, quantity } : i
      );
      syncCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    syncCart([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
