import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";

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
  setItems: (items: CartItem[]) => void;
  addItem: (product: CartProduct, user: User | null) => void;
  removeItem: (productId: string, user: User | null) => void;
  increaseItemQuantity: (productId: string) => void;
  decreaseItemQuantity: (productId: string) => void;
  clearCart: () => void;
  // add this
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: async (product: CartProduct, user: User | null) => {
        let updatedItems: CartItem[] = [];

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );

            return {
              items: updatedItems,
            };
          }

          updatedItems = [...state.items, { ...product, quantity: 1 }];

          return {
            items: updatedItems,
          };
        });

        // Sync to backend
        if (user) {
          try {
            console.log("lets save to backend >>>>>>>>>>>>", user);
            await axios.post("/api/cart", {
              userId: user.id,
              userEmail: user.email,
              items: updatedItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            });
          } catch (error) {
            console.error("Cart sync failed", error);
          }
        }
      },
      removeItem: async (productId: string, user: User | null) => {
        let previousItems: CartItem[] = [];

        set((state) => {
          previousItems = state.items;

          return {
            items: state.items.filter((item) => item.id !== productId),
          };
        });

        // sync backend
        if (user) {
          try {
            await axios.delete("/api/cart", {
              data: {
                userId: user.id,
                productId,
              },
            });
          } catch (error) {
            console.error("Remove item sync failed", error);

            // rollback (important for consistency)
            set({ items: previousItems });
          }
        }
      },
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
      name: "mini-e-commerce-cart",
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
