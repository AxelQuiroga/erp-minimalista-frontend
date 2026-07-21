import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  readonly productCount = signal(0);
  readonly customerCount = signal(0);
  readonly saleCount = signal(0);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getAll(),
      customers: this.customerService.getAll(),
      sales: this.saleService.getAll()
    }).subscribe({
      next: (result) => {
        this.productCount.set(result.products.length);
        this.customerCount.set(result.customers.length);
        this.saleCount.set(result.sales.length);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar datos del dashboard');
        this.loading.set(false);
      }
    });
  }
}
