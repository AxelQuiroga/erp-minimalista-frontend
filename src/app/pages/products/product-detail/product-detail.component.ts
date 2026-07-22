import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { StockMovementService } from '../../../services/stock-movement.service';
import { Product } from '../../../models/product.model';
import { StockMovement } from '../../../models/stock-movement';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  readonly product = signal<Product | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly stockMovements = signal<StockMovement[]>([]);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private stockMovementService: StockMovementService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cargar el producto');
        this.loading.set(false);
      }
    });

    this.stockMovementService.listByProduct(id, 0, 50).subscribe({
      next: (page) => this.stockMovements.set(page.content),
      error: () => {} // silencioso — no crítico
    });
  }
}
