import { type ProductPrice } from "@/store/cart-store";

type ProductImage = {
  id: string;
  imageKey: string;
  productId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductItem = {
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
  createdAt: Date;
  updatedAt: Date;
  ProductImage: ProductImage[];
};
