// order.model.ts
import { PaymentStatus } from "@prisma/client";
import { OrderStatus } from "../../dtos/adminDashboard.dto";
import prisma from "../index";

export const createOrderWithItems = async (
  userId: number,
  cartItems: { productId: number; quantity: number; price: number }[],
  paymentMethod: string
) => {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ สร้าง Order เป็น PENDING
    const order = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        total: cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0),
      },
    });

    // 2️⃣ สร้าง OrderItem
    await tx.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    // 3️⃣ ทำ Payment (สมมติจ่ายสำเร็จ)
    await tx.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        method: paymentMethod,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });

    // 4️⃣ ลด Stock ของสินค้า
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 5️⃣ เปลี่ยนสถานะ Order เป็น COMPLETED
    const completedOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.COMPLETED },
      include: { items: true, payment: true },
    });

    return completedOrder;
  });
};

export const updateProductStock = async (productId: number, quantity: number) => {
  return prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });
};

export const findProductById = async (productId: number) => {
  return prisma.product.findUnique({ where: { id: productId } });
};

export const getOrdersByUser = async (
  userId: number,
  skip: number,
  take: number
) => {

  // ดึง order แบบ pagination
  return prisma.order.findMany({
    where: { userId, isDeleted: false },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true
            },
          },
        },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
};

export const updateOrderStatusToComplete = async (id: number) => {
  return prisma.order.update({
    where: { id },
    data: { status: "COMPLETED" },
    include: {
      items: true,
      payment: true,
    },
  });
};

export const countOrdersByUser = async (userId: number) => {
  return prisma.order.count({
    where: { userId, isDeleted: false },
  });
};

export const getOrderById = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payment: true,
    }
  })
}