export interface Sale {
  id: number;
  customerId: number;
  items: SaleDetail[];
  createdAt: string;
  status: SaleStatus;
  paymentMethod: string;
  notes: string;
  totalAmount: number;
  cancellationReason: string | null;
}

export interface SaleDetail {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type SaleStatus = 'COMPLETED' | 'CANCELLED';

export interface CreateSaleRequest {
  customerId: number;
  items: SaleItemRequest[];
  paymentMethod: string;
  notes?: string;
}

export interface SaleItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CancelSaleRequest {
  reason?: string;
}
