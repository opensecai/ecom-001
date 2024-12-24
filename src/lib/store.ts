import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          const updatedItems = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
          set({
            items: updatedItems,
            total: get().total + item.price,
            itemCount: get().itemCount + 1,
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            total: get().total + item.price,
            itemCount: get().itemCount + 1,
          });
        }
      },
      removeItem: (id) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          set({
            items: items.filter((i) => i.id !== id),
            total: get().total - (item.price * item.quantity),
            itemCount: get().itemCount - item.quantity,
          });
        }
      },
      updateQuantity: (id, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          const diff = quantity - item.quantity;
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
            total: get().total + (item.price * diff),
            itemCount: get().itemCount + diff,
          });
        }
      },
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);