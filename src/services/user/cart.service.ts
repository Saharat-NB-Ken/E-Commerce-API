import * as cartModel from "../../models/user/cart.model";
import { AddCartItemDto, CartResponseDto } from "../../dtos/cart.dto";
import prisma from "../../models/index";
import { ApiError } from "../../utils/apiError";
import * as userModel from "../../models/user/user.model";

// GET cart with total price
export const getCart = async (userId: number): Promise<CartResponseDto> => {
  // query เดียว: get cart + items + products + images
  const cart = await cartModel.getCartByUserId(userId);
  if(!cart) throw ApiError.notFound("Cart not found");
  // totalItems และ totalPrice คำนวณจาก cart.items
  const totalItems = cart.items.length;
  const totalPrice = cart.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return {
    ...cart,
    totalItems,
    totalPrice,
  };
};

// ADD or UPDATE cart item
export const addOrUpdateCartItem = async (userId: number, data: AddCartItemDto) => {
  const { productId, quantity } = data;

  if (quantity <= 0) throw ApiError.badRequest("Quantity must be greater than 0");

  // 1️⃣ สร้าง cart ถ้า user ยังไม่มี
  const cart = await cartModel.createCartIfNotExist(userId);

  // 2️⃣ ตรวจสอบว่าผลิตภัณฑ์มีอยู่ไหม
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound("Product not found");

  // 3️⃣ ตรวจสอบว่า cart item มีอยู่หรือยัง
  const existingItem = await cartModel.findCartItem(cart.id, productId);

  const newQuantity = (existingItem?.quantity ?? 0) + quantity;

  // 4️⃣ ตรวจสอบ stock
  if (newQuantity > product.stock) throw ApiError.badRequest("Not enough stock");

  // 5️⃣ สร้างหรืออัปเดต cart item
  if (existingItem) {
    return cartModel.updateCartItemQuantity(existingItem.id, newQuantity);
  } else {
    return cartModel.createCartItem(cart.id, { productId, quantity });
  }
};
//increment cart item
export const incrementCartItem = async (cartItemId: number, amount: number) => {
  if (!cartItemId) throw ApiError.notFound("User id not found");
  return cartModel.incrementQuantity(cartItemId, amount);
}

//decrement cart item
export const decrementCartItem = async (cartItemId: number, amount: number) => {
  if (!cartItemId) throw ApiError.notFound("User id not found");
  return cartModel.decrementQuantity(cartItemId, amount);
}

//set cart item quantity
export const setCartItemQuantity = async (cartItemId: number, quantity: number) => {
  if (quantity < 0) throw ApiError.badRequest("Quantity cannot be negative");
  return cartModel.setQuantity(cartItemId, quantity);
}

// REMOVE item
export const removeCartItem = async (cartItemId: number) => {
  if (!cartItemId) throw ApiError.badRequest("Cart item ID is required");
  return cartModel.deleteCartItem(cartItemId);
};

// CLEAR cart
export const clearCartService = async (userId: number) => {
  const user = await userModel.getUserById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return cartModel.clearCart(userId);
};
