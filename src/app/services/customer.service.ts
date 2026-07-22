import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../models/customer.model';
import { API_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  private readonly apiUrl = `${API_URL}/api/customers`;

  constructor(private http: HttpClient) {}

  getAll(q?: string, active?: boolean): Observable<Customer[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (active !== undefined) params = params.set('active', active);
    return this.http.get<Customer[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, request);
  }

  update(id: number, request: UpdateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, request);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: { active: boolean }): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}/status`, status);
  }
}
