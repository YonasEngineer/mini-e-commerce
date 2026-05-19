"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../header";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Phone, MapPin, User, Loader2 } from "lucide-react";
import { selectCartTotalPrice, useCartStore } from "@/store/cart-store";

export default function Checkout() {
  const router = useRouter();
  // const [cartData, setCartData] = useState<CartData | null>(null);
  const cartItems = useCartStore((state) => state.items);
  const subtotal = selectCartTotalPrice(cartItems);
  const deliveryFee = 500;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^(\+?251|0)[0-9]{9}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Enter a valid Ethiopian phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Call the backend API to initiate Star Pay payment
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: subtotal,
          phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
          customerName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            item_name: item.name,
            unit_price: Number(item.basePrice),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const data = await response.json();
      console.log("see the   redirect URL >>>>>>>>>>>>>>>>", data);
      // Redirect to Star Pay payment page
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({ submit: "Failed to initiate payment. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Delivery & Payment
              </h2>

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., +251912345678 or 0912345678"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    Delivery Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g., Addis Ababa"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="Enter ZIP code"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                            errors.zipCode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-sm text-gray-700 font-medium">
                    Payment Method:{" "}
                    <span className="text-yellow-600 font-semibold">
                      Star Pay
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    You will be redirected to Star Pay to complete your payment
                    securely.
                  </p>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700 text-sm">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay Now • ${total} ETB`
                  )}
                </button>
              </form>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              {/* Order Items */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-600 text-xs">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {((Number(item.basePrice) * item.quantity) / 100).toFixed(
                        2,
                      )}{" "}
                      ETB
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{(subtotal / 100).toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee} ETB</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>{tax} ETB</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {total} ETB
                </span>
              </div>

              {/* Delivery Notes */}
              {/* {cartData.deliveryNotes && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <p className="text-gray-700 font-medium mb-1">
                    Delivery Notes
                  </p>
                  <p className="text-gray-600">{cartData.deliveryNotes}</p>
                </div>
              )} */}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
