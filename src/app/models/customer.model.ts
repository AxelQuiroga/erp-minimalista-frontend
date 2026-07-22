export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}
