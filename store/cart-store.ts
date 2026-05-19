import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartProductImage = {
  id: string;
  imageKey: string;
  productId: string;
  url: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ProductPrice = string | number | { toString: () => string };

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: ProductPrice;
  ratings: number;
  totalRatings: number;
  salesCount: number;
  stock: number;
  views: number;
  isActive: boolean;
  categoryId: string;
  subCategoryId: string | null;
  keywords: unknown;
  tags: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
  ProductImage: CartProductImage[];
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  increaseItemQuantity: (productId: string) => void;
  decreaseItemQuantity: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      increaseItemQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        })),
      decreaseItemQuantity: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "flikia-cart",
    },
  ),
);

export const selectCartItemsCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalPrice = (items: CartItem[]) =>
  items.reduce(
    (total, item) => total + Number(item.basePrice.toString()) * item.quantity,
    0,
  );
