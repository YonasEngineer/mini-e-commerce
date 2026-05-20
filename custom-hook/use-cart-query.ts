// hooks/use-cart-query.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCartStore } from "@/store/cart-store";

export const useCartQuery = (userId?: string) => {
  const setItems = useCartStore((state) => state.setItems);

  return useQuery({
    queryKey: ["cart", userId],

    queryFn: async () => {
      if (!userId) return [];

      const { data } = await axios.get(`/api/cart?userId=${userId}`);

      console.log("cart items:", data.items);

      // update zustand
      setItems(data.items || []);

      return data.items || [];
    },

    enabled: !!userId,
  });
};
