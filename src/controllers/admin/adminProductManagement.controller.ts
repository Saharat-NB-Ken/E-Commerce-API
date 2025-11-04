import { NextFunction } from "express";
import { getIdFromHeader } from "../../middlewares/auth";
import * as adminManagementService from "../../services/admin/adminProductManagement.service";
import { Request, Response } from "express";
import { getPaginationParams } from "../../utils/query";

export const getAllProductsOfMerchantController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = getIdFromHeader(req);
    const { page, limit, orderBy, orderDirection, search } = getPaginationParams(req.query);

    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const products = await adminManagementService.getProductsByOwner(
      page,
      limit,
      orderBy,
      orderDirection,
      merchantId,
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
export const getProductDetailsById = async (req: Request, res: Response, next: NextFunction) => {
  const merchantId = getIdFromHeader(req);
  const productId = Number(req.params.productId);
  try {
    const product = await adminManagementService.getProductOfMerchantById(productId, merchantId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = getIdFromHeader(req);
    const newProduct = await adminManagementService.createProductService(req.body, ownerId);

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const ownerId = getIdFromHeader(req)
    const updatedProduct = await adminManagementService.updateProduct(ownerId, productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id, 10);
    await adminManagementService.deleteProduct(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
