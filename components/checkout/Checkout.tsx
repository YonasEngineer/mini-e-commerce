"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Phone, MapPin, User, Loader2 } from "lucide-react";
import { selectCartTotalPrice, useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { CheckoutFormValues } from "@/types/checkout";

const phoneRegExp = /^(\+?251|0)[0-9]{9}$/;

const checkoutValidationSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required"),
  phoneNumber: Yup.string()
    .transform((value: string | undefined) => value?.replace(/\s/g, "") || "")
    .matches(phoneRegExp, "Enter a valid Ethiopian phone number")
    .required("Phone number is required"),
  deliveryStreet: Yup.string().trim().required("Street address is required"),
  additionalNote: Yup.string().trim(),
  deliveryZone: Yup.string().trim().required("Delivery zone is required"),
  deliveryLandmark: Yup.string()
    .trim()
    .required("Delivery landmark is required"),
});

export default function Checkout() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const currentUser = useAuthStore((state) => state.user);
  // console.log("see the currentUser", currentUser);
  const subtotal = selectCartTotalPrice(cartItems);
  const deliveryFee = 500;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;

  const formik = useFormik<CheckoutFormValues>({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      deliveryStreet: "",
      additionalNote: "",
      deliveryZone: "",
      deliveryLandmark: "",
    },
    validationSchema: checkoutValidationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(undefined);

      if (!currentUser?.id) {
        setStatus("Please sign in before placing an order.");
        setSubmitting(false);
        return;
      }

      try {
        const { data } = await axios.post(
          "/api/pay",
          {
            userId: currentUser.id,
            customerEmail: currentUser.email,
            customerName: values.fullName.trim(),
            phoneNumber: values.phoneNumber.replace(/\s/g, ""),
            amount: total,
            totalDeliveryFee: deliveryFee,
            deliveryStreet: values.deliveryStreet.trim(),
            additionalNote: values.additionalNote.trim(),
            deliveryZone: values.deliveryZone.trim(),
            deliveryLandmark: values.deliveryLandmark.trim(),
            items: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              itemName: item.name,
              unitPrice: Number(item.basePrice),
            })),
          },
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        if (data.payment_url) {
          window.location.href = data.payment_url;
        }
      } catch (error) {
        console.error("Payment error:", error);
        setStatus(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Payment initiation failed"
            : error instanceof Error
              ? error.message
              : "Failed to initiate payment. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const loading = formik.isSubmitting;
  const getFieldError = (field: keyof CheckoutFormValues) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;

  useEffect(() => {
    if (!cartItems.length) {
      router.push("/");
    }
  }, [cartItems.length, router]);

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Loader2 className=" w-12 h-12 animate-spin mx-auto text-yellow-500" />
            <h1 className="text-gray-600 mt-4 text-2xl">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Delivery & Payment
              </h2>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" />
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          getFieldError("fullName")
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {getFieldError("fullName") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("fullName")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number (Your Start Pay Account Phone Number)
                      </label>
                      <Input
                        type="tel"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., +251912345678 or 0912345678"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          getFieldError("phoneNumber")
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {getFieldError("phoneNumber") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("phoneNumber")}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Input
                        type="text"
                        name="deliveryStreet"
                        value={formik.values.deliveryStreet}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter street address"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          getFieldError("deliveryStreet")
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {getFieldError("deliveryStreet") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("deliveryStreet")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Zone
                      </label>
                      <Input
                        type="text"
                        name="deliveryZone"
                        value={formik.values.deliveryZone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Bole, Piazza, CMC"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          getFieldError("deliveryZone")
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {getFieldError("deliveryZone") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("deliveryZone")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Landmark
                      </label>
                      <Input
                        type="text"
                        name="deliveryLandmark"
                        value={formik.values.deliveryLandmark}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Short landmark name"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          getFieldError("deliveryLandmark")
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {getFieldError("deliveryLandmark") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("deliveryLandmark")}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Note(Optional)
                      </label>
                      <Input
                        type="text"
                        name="additionalNote"
                        value={formik.values.additionalNote}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Apartment, gate code, or delivery note"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          getFieldError("additionalNote")
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {getFieldError("additionalNote") && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError("additionalNote")}
                        </p>
                      )}
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

                {formik.status && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700 text-sm">
                    {formik.status}
                  </div>
                )}

                <Button
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
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-1 lg:order-2 lg:col-span-1">
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
                      <p className="text-gray-600 text-xs">{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {(Number(item.basePrice) * item.quantity).toFixed(2)} ETB
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{subtotal} ETB</span>
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
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
