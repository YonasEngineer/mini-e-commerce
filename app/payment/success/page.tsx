"use client";

import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, Home } from "lucide-react";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  //   const [status, setStatus] = useState<
  //     "loading" | "success" | "failed" | "pending"
  //   >("loading");
  //   const [orderId, setOrderId] = useState("");

  //   useEffect(() => {
  //     // Get payment status from URL parameters (from Star Pay callback)
  //     const paymentStatus = searchParams.get("status");
  //     const order = searchParams.get("order_id");

  //     if (order) {
  //       setOrderId(order);
  //     }

  //     // Simulate checking order status
  //     // In a real app, you would fetch this from your backend
  //     if (paymentStatus === "PAID" || paymentStatus === "success") {
  //       setStatus("success");
  //     } else if (paymentStatus === "FAILED" || paymentStatus === "failed") {
  //       setStatus("failed");
  //     } else if (paymentStatus === "PENDING" || paymentStatus === "pending") {
  //       setStatus("pending");
  //     } else {
  //       // Default to success (Star Pay will redirect here after payment)
  //       setStatus("success");
  //     }
  //   }, [searchParams]);

  const paymentStatus = searchParams.get("status");
  const orderId = searchParams.get("order_id");
  const status =
    paymentStatus === "PAID" || paymentStatus === "success"
      ? "success"
      : paymentStatus === "FAILED" || paymentStatus === "failed"
        ? "failed"
        : paymentStatus === "PENDING" || paymentStatus === "pending"
          ? "pending"
          : "success";

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Your order has been successfully placed and payment received.
            </p>
            {orderId && (
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">{orderId}</p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
              <p className="text-gray-700">
                Your food will be delivered soon! Track your order from your
                account dashboard.
              </p>
            </div>
          </div>
        );

      case "failed":
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <AlertCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Unfortunately, your payment could not be processed.
            </p>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
              <p className="text-red-700">
                Please check your payment details and try again, or contact
                support if the problem persists.
              </p>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-8 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        );

      case "pending":
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Clock className="w-20 h-20 text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Processing
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Your payment is being processed. Please wait...
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-700">
                We will confirm your order once the payment is verified.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 bg-white">
          {renderContent()}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
            >
              <Home className="w-5 h-5" />
              Back Home
            </button>

            {status === "success" && (
              <button
                onClick={() => router.push("/orders")}
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
              >
                View Orders
              </button>
            )}
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <details className="bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-50">
              <summary className="font-semibold text-gray-900">
                How long will delivery take?
              </summary>
              <p className="text-gray-600 mt-2">
                Typical delivery time is 30-45 minutes from confirmation.
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-50">
              <summary className="font-semibold text-gray-900">
                Can I modify my order?
              </summary>
              <p className="text-gray-600 mt-2">
                You can modify orders within 5 minutes of placement. After that,
                please contact support.
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-50">
              <summary className="font-semibold text-gray-900">
                What if my order doesn&apos;t arrive?
              </summary>
              <p className="text-gray-600 mt-2">
                Contact our support team immediately, and we&apos;ll help you
                resolve the issue.
              </p>
            </details>
          </div>
        </div>
      </main>
    </div>
  );
}
