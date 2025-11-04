import { Request, Response, NextFunction } from "express";
import * as cartService from "../../services/user/cart.service";
import { getIdFromHeader } from "../../middlewares/auth";

export const getCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getIdFromHeader(req);
        const cart = await cartService.getCart(
            userId,
        
        );
        res.json(cart);
    } catch (error) {
        next(error);
    }
};

export const addCartItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const item = await cartService.addOrUpdateCartItem(userId, req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const setCartItemQuantityController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const item = await cartService.setCartItemQuantity(userId, req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const incrementCartItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const item = await cartService.incrementCartItem(cartItemId,1);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const decrementCartItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const item = await cartService.decrementCartItem(cartItemId,1);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const removeCartItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.params.cartItemId", req.params.cartItemId);
    
    await cartService.removeCartItem(Number(req.params.cartItemId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const clearCartController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    await cartService.clearCartService(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
