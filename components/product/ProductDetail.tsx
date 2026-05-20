"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, TrendingUp, Eye } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

import type { Prisma } from "@/generated/prisma/client";
import Link from "next/link";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    ProductImage: true;
  };
}>;

type ProductDetailProps = {
  product: ProductWithImages;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const currentUser = useAuthStore((state) => state.user);

  //   const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isLowStock = product.stock < 20;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">Mini</div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="text-slate-600  cursor-pointer hover:text-slate-900">
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 aspect-square relative">
              <Image
                src={product.ProductImage?.[0]?.url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            {/* <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div> */}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(product.ratings)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">
                      {product.ratings} ({product.totalRatings} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-slate-900">
                {Number(product.basePrice)}{" "}
                <span className="text-lg text-slate-600">ETB</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock & Social Proof */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border-slate-200 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-green-600" />
                  <span className="text-2xl font-bold text-slate-900">
                    {product.salesCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600">Sold</p>
              </Card>

              <Card className="bg-white border-slate-200 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye size={20} className="text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">
                    {product.views}
                  </span>
                </div>
                <p className="text-xs text-slate-600">Views</p>
              </Card>

              <Card
                className={`bg-white border-slate-200 p-4 text-center ${isLowStock && inStock ? "border-orange-200" : ""}`}
              >
                <div className="mb-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {product.stock}
                  </span>
                </div>
                <p
                  className={`text-xs font-semibold ${
                    inStock
                      ? isLowStock
                        ? "text-orange-600"
                        : "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {inStock
                    ? isLowStock
                      ? "Low Stock"
                      : "In Stock"
                    : "Out of Stock"}
                </p>
              </Card>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-semibold text-slate-900"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-semibold text-slate-900"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-slate-600 ml-auto">
                  {quantity} of {product.stock} available
                </span>
              </div>

              <Button
                onClick={() => addItem(product, currentUser)}
                disabled={!inStock}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-lg rounded-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
            </div>

            {/* Tags & Keywords */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {((product?.tags as string[]) ?? []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="font-semibold text-slate-900 mb-4">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {((product?.keywords as string[]) ?? []).map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="border-slate-300 text-slate-600"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
