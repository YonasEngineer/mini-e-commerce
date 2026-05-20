import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CartSyncItem = {
  productId: string;
  quantity: number;
};

type CartSyncBody = {
  userId?: string;
  userEmail?: string | null;
  items?: CartSyncItem[];
};

type DeleteCartItemBody = {
  userId?: string;
  productId?: string;
};

const getProfileNameParts = (email?: string | null) => {
  const fallbackName = email?.split("@")[0] || "Customer";

  return {
    firstName: fallbackName,
    lastName: fallbackName,
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CartSyncBody;

  if (!body.userId) {
    return NextResponse.json({ message: "User is required" }, { status: 400 });
  }

  const localItems = (body.items || []).filter(
    (item) => item.productId && item.quantity > 0,
  );
  const localProductIds = localItems.map((item) => item.productId);

  try {
    const syncedCart = await prisma.$transaction(async (tx) => {
      const { firstName, lastName } = getProfileNameParts(body.userEmail);

      await tx.profile.upsert({
        where: { id: body.userId! },
        update: {},
        create: {
          id: body.userId!,
          firstName,
          lastName,
          phoneNumber: "",
          address: "",
        },
      });

      const cart = await tx.cart.upsert({
        where: { userId: body.userId! },
        update: {},
        create: { userId: body.userId! },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          ...(localProductIds.length
            ? { productId: { notIn: localProductIds } }
            : {}),
        },
      });

      const existingProductIds = new Set(
        cart.items.map((item) => item.productId),
      );
      const newItems = localItems.filter(
        (item) => !existingProductIds.has(item.productId),
      );

      if (newItems.length) {
        await tx.cartItem.createMany({
          data: newItems.map((item) => ({
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
      }

      return tx.cart.findUnique({
        where: { id: cart.id },
        include: { items: true },
      });
    });

    return NextResponse.json({ cart: syncedCart });
  } catch (error) {
    console.error("Cart sync error:", error);

    return NextResponse.json(
      { message: "Failed to sync cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as DeleteCartItemBody;
  console.log("see the delet paramete >>>>>>>>>>>", body);
  if (!body.userId || !body.productId) {
    return NextResponse.json(
      { message: "User and product are required" },
      { status: 400 },
    );
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: body.userId },
      select: { id: true },
    });

    if (!cart) {
      return NextResponse.json({ deleted: 0 });
    }

    const result = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: body.productId,
      },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    console.error("Delete cart item error:", error);

    return NextResponse.json(
      { message: "Failed to delete cart item" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 },
    );
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    const formattedItems = cart.items.map((item) => ({
      ...item.product,
      quantity: item.quantity,
    }));

    return NextResponse.json({
      items: formattedItems,
    });
  } catch (error) {
    console.error("Fetch cart error:", error);

    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}
