import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovement, RegisterMovementRequest, Page } from '../models/stock-movement';

@Injectable({ providedIn: 'root' })
export class StockMovementService {

  private readonly apiUrl = 'http://localhost:8080/api/stock-movements';

  constructor(private http: HttpClient) {}

  register(request: RegisterMovementRequest): Observable<StockMovement> {
    return this.http.post<StockMovement>(this.apiUrl, request);
  }

  listByProduct(productId: number, page: number = 0, size: number = 20): Observable<Page<StockMovement>> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<StockMovement>>(this.apiUrl, { params });
  }
}
