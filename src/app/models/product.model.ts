export interface Product {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  sku: string;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  active: boolean;
}

export interface CreateProductRequest {
  categoryId: number;
  name: string;
  sku: string;
  costPrice: number;
  salePrice: number;
  currentStock: number;
}

export interface UpdateProductRequest {
  categoryId: number;
  name: string;
  sku: string;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  active: boolean;
}
