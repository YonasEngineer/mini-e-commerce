"use client";

import { useState } from "react";
import Header from "../header";
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
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Minus } from "lucide-react";
import { selectCartTotalPrice, useCartStore } from "@/store/cart-store";
import Image from "next/image";

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  const subtotal = selectCartTotalPrice(cartItems);
  const decreaseItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity,
  );
  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity,
  );

  const removeItem = useCartStore((state) => state.removeItem);

  const [deliveryNotes, setDeliveryNotes] = useState("");

  const deliveryFee = 500;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    console.log("Proceeding to checkout with notes:", deliveryNotes);
    // Handle checkout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Your cart is empty</p>
            <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600">
              Continue Shopping
            </Button>
          </div>
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
                            ${(Number(item.basePrice) / 100).toFixed(2)}
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
                            $
                            {(
                              (Number(item.basePrice) * item.quantity) /
                              100
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => removeItem(item.id)}
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
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>${(deliveryFee / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${(tax / 100).toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-gray-900 my-6">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>

                {/* Delivery Instructions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Delivery Instructions{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <Textarea
                    placeholder="Add delivery notes (e.g., ring doorbell, place at door, etc.)"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="resize-none text-sm border border-gray-300 rounded-md p-3"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Let the delivery partner know any special instructions
                  </p>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-md transition"
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping Link */}
                <Button
                  variant="outline"
                  className="w-full mt-3 border border-gray-300 text-gray-900"
                >
                  Continue Shopping
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
