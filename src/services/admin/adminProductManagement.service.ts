import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "../../dtos/product.dto";
import * as adminManagementModel from "../../models/admin/adminProductManagement.model";
import { ApiError } from "../../utils/apiError";
import * as imageService from "../../utils/service/image.service";

export const getProductsByOwner = async (
  page: number = 1,
  limit: number = 10,
  orderBy: string = "createdAt",
  orderDirection: "asc" | "desc" = "desc",
  ownerId: number,
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    adminManagementModel.getAllProductsOfMerchant(
      skip,
      limit,
      orderBy,
      orderDirection,
      ownerId,
      category,
      search,
      minPrice,
      maxPrice
    ),
    adminManagementModel.countProductsOfMerchant(ownerId, category, search, minPrice, maxPrice),
  ]);

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orderBy,
      orderDirection,
      category: category || null,
      search: search || null,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
    },
  };
};

export const getProductOfMerchantById = async (productId: number, merchantId: number,) => {
  const product = await adminManagementModel.getProductById(productId, merchantId);
  console.log("merchantId", merchantId);
  console.log("productId", productId);

  if (!merchantId) throw ApiError.notFound("Merchant not found");
  if (!product) throw ApiError.notFound("Product not found");
  return product;
}

export const createProductService = async (data: CreateProductDto, ownerId: number) => {
  const uploadedImages = data.images?.length
    ? await imageService.uploadImagesToCloudinary(data.images.map(img => img.url))
    : [];

  const product = await adminManagementModel.createProduct({
    ...data,
    ownerId,
    images: uploadedImages,
  });

  return product;
};

export const updateProduct = async (
  ownerId: number,
  productId: number,
  data: UpdateProductDto
): Promise<ProductResponseDto> => {
  const currentProduct = await adminManagementModel.getProductById(productId, ownerId);
  if (!currentProduct) throw ApiError.notFound("Product not found");

  const addImagesData = data.addImages?.length ? await imageService.uploadImagesToCloudinary(data.addImages.map(img => img.url)) : undefined;

  const updatedProduct = await adminManagementModel.updateProduct(productId, {
    ...data,
    addImages: addImagesData,
    removeImageIds: data.removeImageIds,
  });

  return {
    id: updatedProduct.id,
    name: updatedProduct.name,
    description: updatedProduct.description,
    price: updatedProduct.price,
    stock: updatedProduct.stock,
    ownerId: updatedProduct.ownerId,
    images: updatedProduct.images.map((img) => ({ id: img.id, url: img.url })),
    categoryId: updatedProduct.categoryId,
    createdAt: updatedProduct.createdAt,
    updatedAt: updatedProduct.updatedAt,
  };
};

export const deleteProduct = async (id: number): Promise<ProductResponseDto> => {
  const product = await adminManagementModel.deleteProduct(id);
  if (!product) throw ApiError.notFound("Product not found");

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    ownerId: product.ownerId,
    images: product.images?.map((img) => ({ id: img.id, url: img.url })) || [],
    categoryId: product.categoryId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

