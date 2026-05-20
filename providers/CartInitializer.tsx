"use client";

import { useCartQuery } from "@/custom-hook/use-cart-query";

export default function CartInitializer({
  userId,
}: {
  userId: string | undefined;
}) {
  useCartQuery(userId);

  return null;
}
