import * as productService from "../services/product.service";
import { Request, Response, NextFunction } from "express";
import { getPaginationParams } from "../utils/query";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, orderBy, orderDirection, search } = getPaginationParams(req.query);
    

    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const products = await productService.getAllProductsService(
      page,
      limit,
      orderBy,
      orderDirection,
      category,
      search,
      minPrice,
      maxPrice
    );

    res.json(products);
  } catch (error) {
    next(error);
  }
};


export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const product = await productService.getProductDetails(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = productService.createImage()
    res.json(image)
  } catch (error) {
    next(error)
  }
}