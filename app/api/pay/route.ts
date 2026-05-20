import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PaymentRequestItem = {
  productId: string;
  quantity: number;
  itemName: string;
  unitPrice: number;
};

type PaymentRequestBody = {
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  phoneNumber?: string;
  amount?: number;
  totalDeliveryFee?: number;
  deliveryStreet?: string;
  additionalNote?: string;
  deliveryZone?: string;
  deliveryLandmark?: string;
  items?: PaymentRequestItem[];
};

type StarPayResponse = {
  data?: {
    payment_url?: string;
    order_id?: string;
    id?: string;
    payment_id?: string;
    billRefNo?: string;
    reference?: string;
  };
};

type StarPayPayload = {
  amount: number;
  description: string;
  currency: "ETB";
  customerName: string;
  customerPhoneNumber: string;
  callbackURL: string;
  redirectUrl: string;
  customerEmail?: string;
  expiredAt: string;
  items: {
    item_name: string;
    unit_price: number;
    productId: string;
    quantity: number;
  }[];
  metadata: {
    orderId: string;
    paymentId: string;
    userId: string;
  };
};

const formatPhoneNumber = (phoneNumber: string) =>
  phoneNumber.startsWith("0") ? `+251${phoneNumber.slice(1)}` : phoneNumber;

const getCustomerNameParts = (customerName: string) => {
  const [firstName, ...rest] = customerName.trim().split(/\s+/);

  return {
    firstName: firstName || "Customer",
    lastName: rest.join(" ") || firstName || "Customer",
  };
};

const getStarPayReference = (data: StarPayResponse, fallback: string) =>
  data.data?.order_id ||
  data.data?.id ||
  data.data?.payment_id ||
  data.data?.billRefNo ||
  data.data?.reference ||
  fallback;

const validatePaymentPayload = (body: PaymentRequestBody) => {
  if (!body.userId) return "User is required";
  if (!body.customerName) return "Customer name is required";
  if (!body.phoneNumber) return "Phone number is required";
  if (!body.amount || body.amount <= 0) return "Amount is required";
  if (body.totalDeliveryFee === undefined || body.totalDeliveryFee < 0) {
    return "Delivery fee is required";
  }
  if (!body.deliveryStreet) return "Delivery street is required";
  if (!body.deliveryZone) return "Delivery zone is required";
  if (!body.deliveryLandmark) return "Delivery landmark is required";
  if (!body.items?.length) return "Order items are required";

  const hasInvalidItem = body.items.some(
    (item) =>
      !item.productId ||
      !item.itemName ||
      item.quantity <= 0 ||
      item.unitPrice <= 0,
  );

  return hasInvalidItem ? "Order items are invalid" : null;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PaymentRequestBody;
  const validationError = validatePaymentPayload(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  if (!process.env.STARPAY_SECRET) {
    return NextResponse.json(
      { message: "StarPay secret is not configured" },
      { status: 500 },
    );
  }

  if (!process.env.CALL_BACK_URL || !process.env.REDIRECT_URL) {
    return NextResponse.json(
      { message: "Payment callback or redirect URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const userId = body.userId!;
    const customerName = body.customerName!.trim();
    const formattedPhone = formatPhoneNumber(body.phoneNumber!);
    const { firstName, lastName } = getCustomerNameParts(customerName);

    const { order, payment } = await prisma.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { id: userId },
        update: {
          firstName,
          lastName,
          phoneNumber: formattedPhone,
          address: body.deliveryStreet!,
        },
        create: {
          id: userId,
          firstName,
          lastName,
          phoneNumber: formattedPhone,
          address: body.deliveryStreet!,
        },
      });

      const order = await tx.order.create({
        data: {
          userId,
          additionalNote: body.additionalNote || null,
          deliveryStreet: body.deliveryStreet,
          deliveryLandmark: body.deliveryLandmark,
          deliveryZone: body.deliveryZone,
          contactPhone: formattedPhone,
          totalPrice: body.amount!,
          totalDeliveryFee: body.totalDeliveryFee!,
          orderItems: {
            create: body.items!.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
              discount: 0,
              totalPrice: item.unitPrice * item.quantity,
            })),
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          paymentProviderId: `STAR_PAY_PENDING_${order.id}`,
          amount: body.amount!,
          currency: "ETB",
          metadata: {
            orderId: order.id,
            userId,
            status: "PENDING_PROVIDER_REQUEST",
          },
        },
      });

      return { order, payment };
    });

    const starPayPayload: StarPayPayload = {
      amount: body.amount!,
      description: `Mini e-commerce order ${order.id}`,
      currency: "ETB",
      customerName,
      customerPhoneNumber: formattedPhone,
      callbackURL: process.env.CALL_BACK_URL,
      redirectUrl: process.env.REDIRECT_URL,
      customerEmail: body.customerEmail,
      expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      items: body.items!.map((item) => ({
        item_name: item.itemName,
        unit_price: item.unitPrice,
        productId: item.productId,
        quantity: item.quantity,
      })),
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
        userId,
      },
    };

    const starPayResponse = await axios.post<StarPayResponse>(
      "https://starpayqa.starpayethiopia.com/v1/starpay-api/trdp/order",
      starPayPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": process.env.STARPAY_SECRET,
        },
      },
    );

    const paymentUrl = starPayResponse.data.data?.payment_url;

    if (!paymentUrl) {
      throw new Error("StarPay did not return a payment URL");
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentProviderId: getStarPayReference(starPayResponse.data, payment.id),
        metadata: {
          starPayResponse: starPayResponse.data,
          starPayPayload,
        },
      },
    });

    return NextResponse.json({
      order_id: order.id,
      payment_id: payment.id,
      payment_url: paymentUrl,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "StarPay error detail:",
        error.response?.data || error.message,
      );

      return NextResponse.json(
        {
          message:
            error.response?.data?.message ||
            "Failed to initiate StarPay payment",
        },
        { status: error.response?.status || 502 },
      );
    }

    console.error("Payment initiation error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to initiate payment",
      },
      { status: 500 },
    );
  }
}
