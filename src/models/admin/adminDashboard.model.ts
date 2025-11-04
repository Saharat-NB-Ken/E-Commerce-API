import { Prisma } from "@prisma/client";
import { OrderStatus } from "../../dtos/adminDashboard.dto";
import prisma from "../index";
import { startOfDay, startOfMonth, startOfYear } from "date-fns";

export const getStartDate = (period?: "day" | "month" | "year") => {
  const now = new Date();
  switch (period) {
    case "day":
      return startOfDay(now);
    case "month":
      return startOfMonth(now);
    case "year":
      return startOfYear(now);
    default:
      return undefined;
  }
};

// ------------------ Orders ของ Merchant ------------------
export const getMerchantOrdersModel = async (merchantId: number, status?: OrderStatus, period?: "day" | "month" | "year") => {
  const startDate = getStartDate(period);

  return prisma.orderItem.findMany({
    where: {
      product: { ownerId: merchantId },
      order: {
        status: status ? status : undefined,
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
      },
    },
    include: { order: { include: { user: true, payment: true } }, product: true },
  });
};

// ------------------ Revenue ของ Merchant ------------------
export const getRevenueByPeriodModel = async (
  merchantId: number,
  period: "day" | "week" | "month"
) => {
  const now = new Date();
  let startDate: Date;

  if (period === "day") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else if (period === "week") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 28);
  } else {
    startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }

  // สร้าง subquery สำหรับ period
  let periodExpr: string;
  if (period === "day") periodExpr = "DATE(o.createdAt)";
  else if (period === "week") periodExpr = "CONCAT(YEAR(o.createdAt), '-', LPAD(WEEK(o.createdAt, 1), 2, '0'))";
  else periodExpr = "DATE_FORMAT(o.createdAt, '%Y-%m')";

  const query = Prisma.sql`
    SELECT 
      t.period AS period,
      SUM(t.total) AS revenue
    FROM (
      SELECT 
        ${Prisma.raw(periodExpr)} AS period,
        o.total
      FROM \`Order\` o
      JOIN OrderItem oi ON oi.orderId = o.id
      JOIN Product p ON p.id = oi.productId
      WHERE o.status = 'COMPLETED'
        AND p.ownerId = ${merchantId}
        AND o.createdAt >= ${startDate.toISOString().slice(0, 19).replace("T", " ")}
    ) t
    GROUP BY t.period
    ORDER BY t.period ASC;
  `;

  const data = await prisma.$queryRaw<any[]>(query);

  return data.map((item) => ({
    period: item.period,
    revenue: Number(item.revenue),
  }));
};
// ------------------ Notifications ของ Merchant ------------------
export const getNotificationsModel = async (merchantId: number, period?: "day" | "month" | "year") => {
  const startDate = getStartDate(period);

  return prisma.notification.findMany({
    where: {
      userId: merchantId,
      ...(startDate ? { createdAt: { gte: startDate } } : {}),
    },
  });
};

// ------------------ Completed Orders พร้อม Category ------------------
export const getCompletedOrdersWithCategory = async (period?: "day" | "month" | "year") => {
  const startDate = getStartDate(period);

  return prisma.order.findMany({
    where: {
      status: "COMPLETED",
      ...(startDate ? { createdAt: { gte: startDate } } : {}),
    },
    include: {
      items: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  });
};
