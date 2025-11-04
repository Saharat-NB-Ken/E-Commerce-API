import { ProductResponseDto } from "../dtos/product.dto";
import * as productModel from "../models/product.model";
import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from "../utils/apiError";

export const getAllProductsService = async (
  page: number = 1,
  limit: number = 10,
  orderBy: string = "createdAt",
  orderDirection: "asc" | "desc" = "desc",
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    productModel.getAllProducts(skip, limit, orderBy, orderDirection, category, search, minPrice, maxPrice),
    productModel.countProducts(category, search, minPrice, maxPrice),
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


export const getProductDetails = async (id: number): Promise<ProductResponseDto> => {
    const product = await productModel.getProductById(id);
    if (!product) {
        throw ApiError.notFound("Product not found");
    }
    return product as ProductResponseDto;
};


export const createImage = async () => {
    console.log("3443433");

    // Configuration
    cloudinary.config({
        cloud_name: 'dqlj1haau',
        api_key: '725495665886787',
        api_secret: 'eTeorwUseMl0Fo4hf6TAvzqHIz4'
    });

    // CLOUDINARY_URL=cloudinary://725495665886787:**********@dqlj1haau

    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            '/Users/saharat/study/E-Commerce-API/src/images/free-nature-images.jpg', {
            folder: "test",
            public_id: 'free-nature',
        }
        )
        .catch((error) => {
            console.log(error);
        });

    console.log(uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });

    console.log(optimizeUrl);

    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });

    console.log(autoCropUrl);
}