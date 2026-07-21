import { Component, OnInit, signal, computed } from '@angular/core';
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
  readonly togglingId = signal<number | null>(null);
  readonly showInactive = signal(false);
  readonly filteredProducts = computed(() => {
    const all = this.products();
    return this.showInactive() ? all : all.filter(p => p.active);
  })

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
    if (!confirm('¿Estás seguro de desactivar este producto? Dejará de estar disponible en ventas.')) return;

    this.togglingId.set(id);                                             // ← NUEVO
    this.productService.deactivate(id).subscribe({
        next: () => {
            this.products.update(list =>
                list.map(p => p.id === id ? { ...p, active: false } : p)
            );
            this.togglingId.set(null);                                   // ← NUEVO
        },
        error: () => {
            this.error.set('Error al desactivar el producto');
            this.togglingId.set(null);                                   // ← NUEVO
        }
    });
}

  reactivateProduct(id: number): void {
    if (!confirm('¿Estás seguro de reactivar este producto?')) return;

    this.togglingId.set(id);                                             // ← NUEVO
    this.productService.updateStatus(id, { active: true }).subscribe({
        next: (updated) => {
            this.products.update(list =>
                list.map(p => p.id === id ? updated : p)
            );
            this.togglingId.set(null);                                   // ← NUEVO
        },
        error: () => {
            this.error.set('Error al reactivar el producto');
            this.togglingId.set(null);                                   // ← NUEVO
        }
    });
}
}
