export interface StockMovement {
  id: number;
  productId: number;
  quantity: number;
  type: MovementType;
  createdAt: string;
  reason: string;
  absoluteQuantity: number;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface RegisterMovementRequest {
  productId: number;
  quantity: number;
  type: MovementType;
  reason: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
