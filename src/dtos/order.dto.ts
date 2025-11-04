export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemInput[];
}

export interface OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface getOrderResponseDto {
  id: number;
  items: OrderItemResponseDto[];
  totalAmount: number;
  shipping: number;
  tax: number;
  status: string;
  isDeleted: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}


export type OrderVisibility = "all" | "active" | "deleted";
