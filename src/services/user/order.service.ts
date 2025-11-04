// order.service.ts
import { CreateOrderDto } from "../../dtos/order.dto";
import { ApiError } from "../../utils/apiError";
import { OrderStatus } from "@prisma/client";
import * as orderModel from "../../models/user/order.model";
import prisma from "../../models/index";
import { orderSuccessEmailAdmin, orderSuccessEmailUser, productLowStockAlert, sendingCompletedStatusPayment } from "../../utils/service/email.service";
import * as userModel from "../../models/user/user.model";

export const createOrder = async (userId: number, input: CreateOrderDto) => {
  const user = await userModel.getUserById(userId);
  if (!user) throw new ApiError(404, "User not found!");
  if (!input.items || input.items.length === 0) {
    throw ApiError.badRequest("Order must have at least one item");
  }

  let total = 0;

  // ตรวจสอบสินค้า + คำนวณ total
  const orderItemsData = await Promise.all(
    input.items.map(async (item) => {
      const product = await orderModel.findProductById(item.productId);
      if (!product) throw ApiError.notFound(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Not enough stock for product ${product.name}`);
      }
      total += product.price * item.quantity;
      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  // Transaction: สร้าง Order + ลด stock
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.PENDING,
        items: { create: orderItemsData },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      }
    });

    for (const item of orderItemsData) {
      const updatedProduct = await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      if (updatedProduct.stock < 10) {
        await productLowStockAlert(
          process.env.ADMIN_EMAIL!,
          updatedProduct.name,
          updatedProduct.stock
        );
      }
    }


    return newOrder;
  });

  const shipping = order.total > 500 ? 0 : 15;
  const tax = order.total * 0.1;
  const totalAmount = order.total + shipping + tax;

  if (process.env.ADMIN_EMAIL) {
    await orderSuccessEmailAdmin(
      process.env.ADMIN_EMAIL,
      user.name,
      order.items.map((item) => ({
        productName: item.product.name,
        productImage: item.product.images[0]?.url,
        quantity: item.quantity,
        price: item.price * item.quantity,
      })),
      order.total,
      shipping,
      tax,
      totalAmount);
  }

  await orderSuccessEmailUser(
    user.email,
    user.name,
    order.items.map((item) => ({
      productName: item.product.name,
      productImage: item.product.images[0]?.url,
      quantity: item.quantity,
      price: item.price * item.quantity,
    })),
    order.total,
    shipping,
    tax,
    totalAmount);
  await sendingCompletedStatusPayment(
    user.email,
    user.name,
    order.id,
    order.items.map((item) => ({
      productName: item.product.name,
      productImage: item.product.images[0]?.url,
      quantity: item.quantity,
      price: item.price * item.quantity,
    })),
    order.total,
    shipping,
    tax,
    totalAmount);

  await changeStatusToCompleted(order.id)
  return order;
};

export const getUserOrders = async (userId: number, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const total = await orderModel.countOrdersByUser(userId);
  const orders = await orderModel.getOrdersByUser(userId, skip, pageSize);
  if (!orders) throw ApiError.notFound("Orders not found")
  return { data: orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export const changeStatusToCompleted = async (orderId: number) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    throw ApiError.notFound("Order not found");
  }
  const changeStatus = orderModel.updateOrderStatusToComplete(orderId);
  return changeStatus
}

