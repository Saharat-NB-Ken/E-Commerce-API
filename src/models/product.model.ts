import prisma from "./index";

export const getAllProducts = async (
  skip: number,
  take: number,
  orderBy: string,
  orderDirection: "asc" | "desc",
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const allowedOrderBy = ["name", "price", "stock", "createdAt", "updatedAt"];
  if (!allowedOrderBy.includes(orderBy)) {
    orderBy = "createdAt";
  }

  return prisma.product.findMany({
    skip,
    take,
    orderBy: {
      [orderBy]: orderDirection,
    },
    where: {
      ...(category ? { category: { name: category } } : {}),
      ...(search
        ? {
            name: { contains: search },
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    },
    include: {
      category: true,
      images: true,
    },
  });
};


export const countProducts = async (
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  return prisma.product.count({
    where: {
      ...(category ? { category: { name: category } } : {}),
      ...(search
        ? {
            name: { contains: search },
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true
    }
  });
};



