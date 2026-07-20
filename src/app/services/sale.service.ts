import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, CreateSaleRequest, CancelSaleRequest } from '../models/sale.model';

@Injectable({ providedIn: 'root' })
export class SaleService {

  private readonly apiUrl = 'http://localhost:8080/api/sales';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateSaleRequest): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, request);
  }

  cancel(id: number, request?: CancelSaleRequest): Observable<Sale> {
    return this.http.patch<Sale>(`${this.apiUrl}/${id}/cancel`, request);
  }
}
