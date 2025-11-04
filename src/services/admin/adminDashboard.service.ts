import { OrderStatus } from "../../dtos/adminDashboard.dto";
import * as adminDashboardModel from "../../models/admin/adminDashboard.model";
import { ApiError } from "../../utils/apiError";
import prisma from "../../models/index";

export const getMerchantOrders = async (
  merchantId: number,
  status?: OrderStatus,
  period?: "day" | "month" | "year"
) => {
  if (!merchantId) throw ApiError.notFound("Merchant not found");

  const merchant = await prisma.user.findUnique({ where: { id: merchantId } });
  if (!merchant) throw ApiError.notFound("Merchant does not exist");

  const orders = await adminDashboardModel.getMerchantOrdersModel(merchantId, status, period);

  return orders.map(o => ({
    orderId: o.order.id,
    user: o.order.user,
    product: o.product,
    quantity: o.quantity,
    status: o.order.status,
    payment: o.order.payment,
    createdAt: o.order.createdAt,
  }));
};

export const getRevenue = async (
  merchantId: number,
  period: "day" | "week" | "month" = "month"
) => {
  if (!merchantId) throw new ApiError(404, "Merchant not found");

  const revenueRows = await adminDashboardModel.getRevenueByPeriodModel(merchantId, period);

  const totalRevenue = revenueRows.reduce((sum, r) => sum + Number(r.revenue || 0), 0);

  return {
    summary: {
      totalRevenue,
    },
    breakdown: revenueRows.map(r => ({
      period: r.period,
      revenue: Number(r.revenue || 0),
    })),
  };
};

export const getNotifications = async (
  merchantId: number,
  period?: "day" | "month" | "year"
) => {
  if (!merchantId) throw new ApiError(404, "Merchant not found");

  const notifications = await adminDashboardModel.getNotificationsModel(merchantId, period);

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getCategorySales = async (period?: "day" | "month" | "year") => {
  const orders = await adminDashboardModel.getCompletedOrdersWithCategory(period);

  const categoryMap: Record<string, { sales: number; quantity: number }> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const category = item.product.category.name;
      const sales = item.price * item.quantity;
      const quantity = item.quantity;

      if (!categoryMap[category]) categoryMap[category] = { sales: 0, quantity: 0 };

      categoryMap[category].sales += sales;
      categoryMap[category].quantity += quantity;
    });
  });

  const totalSales = Object.values(categoryMap).reduce((a, b) => a + b.sales, 0);
  const totalQty = Object.values(categoryMap).reduce((a, b) => a + b.quantity, 0);

  return Object.entries(categoryMap).map(([category, { sales, quantity }]) => ({
    category,
    sales,
    quantity,
    salesPercentage: totalSales ? (sales / totalSales) * 100 : 0,
    quantityPercentage: totalQty ? (quantity / totalQty) * 100 : 0,
  }));
};


