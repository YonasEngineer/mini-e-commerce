"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Minus } from "lucide-react";
import { selectCartTotalPrice, useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import EmptyCart from "../CartSidebarModal/EmptyCart";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  const subtotal = selectCartTotalPrice(cartItems);
  const currentUser = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);

  const decreaseItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity,
  );
  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity,
  );
  const router = useRouter();
  const removeItem = useCartStore((state) => state.removeItem);

  const deliveryFee = 500;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  const authenticateUser = () => {
    if (!currentUser || !session) router.push("/auth");
    else router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Shopping Cart
                </h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="text-gray-900 font-semibold">
                          Product
                        </TableHead>
                        <TableHead className="text-gray-900 font-semibold">
                          Price
                        </TableHead>
                        <TableHead className="text-gray-900 font-semibold">
                          Quantity
                        </TableHead>
                        <TableHead className="text-gray-900 font-semibold">
                          Subtotal
                        </TableHead>
                        <TableHead className="text-gray-900 font-semibold text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                width={500}
                                height={500}
                                src={item.ProductImage?.[0]?.url}
                                alt={item.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <span className="text-gray-900 font-medium">
                                {item.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            ETB {Number(item.basePrice)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center border border-gray-300 rounded w-fit">
                              <button
                                onClick={() => decreaseItemQuantity(item.id)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1 text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increaseItemQuantity(item.id)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900 font-medium">
                            ETB {Number(item.basePrice) * item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => removeItem(item.id, currentUser)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>

            {/* Order Summary & Delivery Instructions */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span> ETB {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>ETB {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span>ETB {tax}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-gray-900 my-6">
                  <span>Total</span>
                  <span> ETB {total}</span>
                </div>

                {/* Checkout Button */}
                <div onClick={authenticateUser}>
                  <Button className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-md transition">
                    Proceed to Checkout
                  </Button>
                </div>

                {/* Continue Shopping Link */}
                <Link href={"/"}>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer mt-3 border border-gray-300 text-gray-900"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
