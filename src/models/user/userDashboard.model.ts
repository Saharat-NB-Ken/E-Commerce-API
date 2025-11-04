import prisma from "../index";

export const getProfile = async(userId: number) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  }
  
export const getMoneySpent = async(userId: number) => {
    const data = await prisma.order.groupBy({
      by: ["userId"],
      where: { userId, status: "COMPLETED" },
      _sum: { total: true },
    });
    return data[0]?._sum.total || 0;
  }

  export const getOrdersCount = async(userId: number) => {
    return prisma.order.count({
      where: { userId, status: "COMPLETED" },
    });
  }

  export const getProductsByCategory = async(userId: number) => {
    const data = await prisma.orderItem.findMany({
      where: { order: { userId, status: "COMPLETED" } },
      include: { product: true },
    });

    // group by category (สมมติว่ามี field category ใน Product)
    const categoryMap: Record<string, number> = {};
    data.forEach((item) => {
      const cat = (item.product as any).category || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + item.quantity;
    });

    return categoryMap;
  }

  export const getCart = async(userId: number) => {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } }
      }
    });
  }

  export const getOrders = async(userId: number) => {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        payment: true
      }
    });
  }

  export const getWishlist = async(userId: number) => {
    // ❓ Prisma schema ยังไม่มี Wishlist table
    // คุณต้องเพิ่ม model Wishlist ก่อน เช่น
    // model Wishlist { id Int @id @default(autoincrement()) userId Int ... }
    // แล้ว query เหมือน getCart
    return [];
  }

  export const getNotifications = async(userId: number) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

