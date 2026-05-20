"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, Home } from "lucide-react";
export default function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
            {" "}
            <div className="flex justify-center mb-6">
              {" "}
              <CheckCircle className="w-20 h-20 text-green-500" />{" "}
            </div>{" "}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {" "}
              Order Confirmed!{" "}
            </h1>{" "}
            <p className="text-gray-600 text-lg mb-6">
              {" "}
              Your order has been successfully placed and payment received.{" "}
            </p>{" "}
            {orderId && (
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                {" "}
                <p className="text-sm text-gray-600">Order Number</p>{" "}
                <p className="text-2xl font-bold text-gray-900">
                  {orderId}
                </p>{" "}
              </div>
            )}{" "}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
              {" "}
              <p className="text-gray-700">
                {" "}
                Your food will be delivered soon! Track your order from your
                account dashboard.{" "}
              </p>{" "}
            </div>{" "}
          </div>
        );
      case "failed":
        return (
          <div className="text-center">
            {" "}
            <div className="flex justify-center mb-6">
              {" "}
              <AlertCircle className="w-20 h-20 text-red-500" />{" "}
            </div>{" "}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {" "}
              Payment Failed{" "}
            </h1>{" "}
            <p className="text-gray-600 text-lg mb-6">
              {" "}
              Unfortunately, your payment could not be processed.{" "}
            </p>{" "}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
              {" "}
              <p className="text-red-700">
                {" "}
                Please check your payment details and try again, or contact
                support if the problem persists.{" "}
              </p>{" "}
            </div>{" "}
            <button
              onClick={() => router.push("/checkout")}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-8 rounded-lg transition"
            >
              {" "}
              Try Again{" "}
            </button>{" "}
          </div>
        );
      case "pending":
        return (
          <div className="text-center">
            {" "}
            <div className="flex justify-center mb-6">
              {" "}
              <Clock className="w-20 h-20 text-yellow-500 animate-spin" />{" "}
            </div>{" "}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {" "}
              Payment Processing{" "}
            </h1>{" "}
            <p className="text-gray-600 text-lg mb-6">
              {" "}
              Your payment is being processed. Please wait...{" "}
            </p>{" "}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              {" "}
              <p className="text-yellow-700">
                {" "}
                We will confirm your order once the payment is verified.{" "}
              </p>{" "}
            </div>{" "}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* <Header /> */}{" "}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {" "}
        <Card className="p-8 bg-white">
          {" "}
          {renderContent()} {/* Action Buttons */}{" "}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t">
            {" "}
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center bg-primary justify-center gap-2 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
            >
              {" "}
              <Home className="w-5 h-5" /> Back Home{" "}
            </button>{" "}
          </div>{" "}
        </Card>{" "}
      </main>{" "}
    </div>
  );
}
