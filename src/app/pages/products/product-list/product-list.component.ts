import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar productos');
        this.loading.set(false);
      }
    });
  }

  deactivateProduct(id: number): void {
    if (!confirm('¿Estás seguro de desactivar este producto? Se descontará del stock automáticamente.')) return;

    this.productService.deactivate(id).subscribe({
      next: () => {
        this.products.update(list =>
          list.map(p => p.id === id ? { ...p, active: false } : p)
        );
      },
      error: () => {
        this.error.set('Error al desactivar el producto');
      }
    });
  }
}
