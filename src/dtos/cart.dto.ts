export interface AddCartItemDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  cartItemId: number;
  quantity: number;
}

export interface CartItemResponseDto {
  cartItem_id: number;
  cartId: number;
  productId: number;
  product: {
    name: string;
    price: number;
    stock: number;
    images: { id: number; url: string }[];
  };
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartResponseDto {
  cart_id: number;
  userId: number;
  items: CartItemResponseDto[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// export interface ProductResponseDto {
//   id: number;
//   name: string;
//   description: string | null;
//   price: number;
//   stock: number;
//   ownerId: number;
//   images: { id: number; url: string }[];
//   createdAt: Date;
//   updatedAt: Date;
//   categoryId: number;
// }
