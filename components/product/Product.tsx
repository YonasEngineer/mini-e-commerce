"use client";
import Image from "next/image";
import React from "react";
import { useCartStore } from "@/store/cart-store";
import { ProductItem } from "@/types/product";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

type ProductProps = {
  products: ProductItem[];
};

const Product = ({ products }: ProductProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Mini E-commerce
      </h1>

      <p className="text-gray-600 mb-8">
        Browse our wide selection of products and enjoy fast delivery to your
        doorstep.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => {
          return (
            <div
              key={product.id}
              className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="bg-gray-300 h-48 rounded mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
                {product?.ProductImage?.[0]?.url ? (
                  <Image
                    width={500}
                    height={500}
                    src={product.ProductImage[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <Link href={`/product/${product.id}`}>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 hover:text-yellow-500">
                  {product.description}
                </p>
              </Link>

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">
                  ETB {product.basePrice.toString()}
                </span>

                <button
                  onClick={() => addItem(product, currentUser)}
                  className="bg-yellow-400 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Product;
