// import { PaymentContent }
import PaymentContent from "@/components/payment/Success";
import { Suspense } from "react";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
    </div>
  );
}
