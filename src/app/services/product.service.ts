import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.model';
import { API_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = `${API_URL}/api/products`;

  constructor(private http: HttpClient) {}

  getAll(q?: string, minStock?: number, active?: boolean): Observable<Product[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (minStock !== undefined) params = params.set('minStock', minStock);
    if (active !== undefined) params = params.set('active', active);
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, request);
  }

  update(id: number, request: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, request);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: { active: boolean }): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/status`, status);
  }
}
