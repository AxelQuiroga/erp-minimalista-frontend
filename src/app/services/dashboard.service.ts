import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';
import { API_URL } from '../api.config';

export interface DashboardData {
  productCount: number;
  customerCount: number;
  saleCount: number;
  salesToday: number;
  salesTodayAmount: number;
  lowStockCount: number;
  recentSales: Sale[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly apiUrl = `${API_URL}/api/dashboard`;

  constructor(private http: HttpClient) {}

  get(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }
}
