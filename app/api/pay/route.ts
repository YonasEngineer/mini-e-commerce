import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json(); // read once into variable
  console.log("see the payment detail here", body);
  const { customerName, phoneNumber, amount, items } = body; // destructure from variable
  console.log(
    "see   the  process.env.STARPAY_SECRET ",
    process.env.STARPAY_SECRET,
  );
  const formattedPhone = phoneNumber.startsWith("0")
    ? "+251" + phoneNumber.slice(1)
    : phoneNumber;
  const response = await fetch(
    "https://starpayqa.starpayethiopia.com/v1/starpay-api/trdp/order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": process.env.STARPAY_SECRET!,
      },
      body: JSON.stringify({
        amount,
        description: "My Product",
        currency: "ETB",
        customerName: customerName,
        customerPhoneNumber: formattedPhone,
        callbackURL: "http://localhost:3000/api/starpay/callback",
        redirectUrl: "http://localhost:3000/payment/success",
        items,
        customerEmail: "test12@gmail.com",
        expiredAt: "2026-07-01T23:59:59Z",
        metadata: {
          order_reference: "ORD-2025-001",
          custom_field: "any value",
        },
      }),
    },
  );
  const data = await response.json();
  console.log("StarPay error detail:", JSON.stringify(data, null, 2)); // ← add this
  return NextResponse.json({ payment_url: data.data.payment_url });
}
