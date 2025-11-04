export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  ownerId: number;
  images?: { name: string; url: string }[]; 
  categoryId: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  addImages?: { name: string; url: string }[]; 
  removeImageIds?: number[]; 
  categoryId?: number;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  ownerId: number;
  images: { id: number; url: string }[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
}
