import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const request = await req.json();
  const { status, billRefNo, amount } = request;
  console.log("see the  webhook is reached in my server>>>>>>>>>>>>", request);
  if (status === "PAID" || status === "SETTLED") {
    //  Mark order as paid in your DB
  }

  return NextResponse.json({ received: true });
}
