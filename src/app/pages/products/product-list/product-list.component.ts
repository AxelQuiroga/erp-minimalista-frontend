import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly togglingId = signal<number | null>(null);
  readonly showInactive = signal(false);
  readonly search = signal('');

  private readonly search$ = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  readonly filteredProducts = computed(() => {
    const all = this.products();
    return this.showInactive() ? all : all.filter(p => p.active);
  });

  constructor(private productService: ProductService) {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.productService.getAll(term || undefined)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => this.products.set(data),
      error: () => this.error.set('Error al buscar productos')
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.search$.next(value);
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

    this.togglingId.set(id);
    this.productService.deactivate(id).subscribe({
        next: () => {
            this.products.update(list =>
                list.map(p => p.id === id ? { ...p, active: false } : p)
            );
            this.togglingId.set(null);
        },
        error: () => {
            this.error.set('Error al desactivar el producto');
            this.togglingId.set(null);
        }
    });
  }

  reactivateProduct(id: number): void {
    if (!confirm('¿Estás seguro de reactivar este producto?')) return;

    this.togglingId.set(id);
    this.productService.updateStatus(id, { active: true }).subscribe({
        next: (updated) => {
            this.products.update(list =>
                list.map(p => p.id === id ? updated : p)
            );
            this.togglingId.set(null);
        },
        error: () => {
            this.error.set('Error al reactivar el producto');
            this.togglingId.set(null);
        }
    });
  }
}
