import { CreateProductDto, UpdateProductDto } from "../../dtos/product.dto";
import prisma from "../index";

export const getAllProductsOfMerchant = (
  skip: number,
  take: number,
  orderBy: string,
  orderDirection: "asc" | "desc",
  ownerId: number,
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

export const countProductsOfMerchant = (ownerId: number, category?: string, search?: string, minPrice?: number, maxPrice?: number) => {
  const whereClause: any = { ownerId };

  if (category) whereClause.category = { name: category };
  if (search)
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  if (minPrice !== undefined || maxPrice !== undefined)
    whereClause.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };

  return prisma.product.count({ where: whereClause });
};


export const getProductById = (id: number, ownerId: number) => {
  return prisma.product.findFirst({
    where: { id, ownerId },
    include: { images: true, stats: true },
  });
};

export const createProduct = (data: CreateProductDto & { ownerId: number }) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      ownerId: data.ownerId,
      images: data.images?.length ? { create: data.images } : undefined,
      categoryId: data.categoryId
    },
    include: { images: true },
  });
};

export const updateProduct = (id: number, data: UpdateProductDto) => {
  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      images: {
        deleteMany: data.removeImageIds ? { id: { in: data.removeImageIds } } : undefined,
        create: data.addImages ? data.addImages : undefined,
      },
      categoryId: data.categoryId
    },
    include: { images: true },
  });
};

export const deleteProduct = (id: number) => {
  return prisma.product.delete({
    where: { id },
    include: {
      images: true,
    },
  });
};

