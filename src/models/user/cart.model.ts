import prisma from "../index";
import { AddCartItemDto, CartResponseDto } from "../../dtos/cart.dto";
import { ApiError } from "../../utils/apiError";

async function validateStock(productId: number, quantity: number) {  
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404,"Product not found");  
  if (quantity > product.stock) {
    throw new ApiError(404,`Not enough stock. Available: ${product.stock}`);
  }
  return product;
}

export const getCartByUserId = async (userId: number): Promise<CartResponseDto> => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: "desc" }, 
        include: {
          product: {
            include: { images: true }
          }
        }
      }
    }
  })

  if (!cart) {
    throw new Error("Cart not found");
  }

  const totalItems = cart.items.length;
  const totalPrice = cart.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return {
    cart_id: cart.id,
    userId: cart.userId,
    items: cart.items.map(i => ({
      cartItem_id: i.id,
      cartId: i.cartId,
      productId: i.productId,
      product: {
        name: i.product.name,
        price: i.product.price,
        stock: i.product.stock,
        images: i.product.images.map(img => ({
          id: img.id,
          url: img.url,
          isMain: img.isMain,
          createdAt: img.createdAt
        }))
      },
      quantity: i.quantity,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    })),
    totalItems,
    totalPrice,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
};

export const createCartItem = async (userId: number, data: AddCartItemDto) => {
  let cart = await prisma.cart.findUnique({ where: { id: userId } });  
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity ?? 1,
    },
    include: { product: true },
  });
};

export const addOrUpdateCartItem = async (userId: number, data: AddCartItemDto) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: data.productId } },
    include: { product: true },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + data.quantity;
    await validateStock(data.productId, newQty);

    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
      include: { product: true },
    });
  }

  await validateStock(data.productId, data.quantity);

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId: data.productId, quantity: data.quantity },
    include: { product: true },
  });
};


export const setQuantity = async (cartItemId: number, quantity: number) => {
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { product: true } });
  if (!item) throw new Error("Cart item not found");

  await validateStock(item.productId, quantity);

  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { product: true },
  });
};

export const incrementQuantity = async (cartItemId: number, amount = 1) => {
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { product: true } });
  console.log("11111");

  if (!item) throw new ApiError(404,"Cart item not found");
console.log("22222");
  
  const newQty = item.quantity + amount;
  console.log("33333");
  
  await validateStock(item.productId, newQty);
console.log("4444444");
  
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: newQty },
    include: { product: true },
  });
};


export const decrementQuantity = async (cartItemId: number, amount = 1) => {
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { product: true } });
  if (!item) throw new Error("Cart item not found");

  const newQty = item.quantity - amount;
  if (newQty <= 0) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  await validateStock(item.productId, newQty);

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: newQty },
    include: { product: true },
  });
};


export const createCartIfNotExist = async (userId: number) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
};

// หา cart item โดย cartId + productId
export const findCartItem = async (cartId: number, productId: number) => {
  return prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
    include: { product: true },
  });
};

// update quantity
export const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { product: true } });
  if (!item) throw new Error("Cart item not found");

  await validateStock(item.productId, quantity);

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { product: true },
  });
};


export const deleteCartItem = async (cartItemId: number) => {
  return prisma.cartItem.delete({ where: { id: cartItemId } });
};

export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return null;
  return prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};
