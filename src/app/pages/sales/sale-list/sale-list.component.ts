import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale.model';

@Component({
  selector: 'app-sale-list',
  imports: [RouterLink, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.scss'
})
export class SaleListComponent implements OnInit {

  readonly sales = signal<Sale[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly statusFilter = signal('');
  readonly fromFilter = signal('');
  readonly toFilter = signal('');

  private readonly filter$ = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);

  constructor(private saleService: SaleService) {
    this.filter$.pipe(
      debounceTime(300),
      switchMap(() => {
        const status = this.statusFilter() || undefined;
        const from = this.fromFilter() || undefined;
        const to = this.toFilter() || undefined;
        if (!status && !from && !to) {
          return this.saleService.getAll();
        }
        return this.saleService.getAll(status, from, to);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => this.sales.set(data),
      error: () => this.error.set('Error al filtrar ventas')
    });
  }

  ngOnInit(): void {
    this.loadSales();
  }

  onFilterChange(): void {
    this.filter$.next();
  }

  private loadSales(): void {
    this.saleService.getAll().subscribe({
      next: (data) => {
        this.sales.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar ventas');
        this.loading.set(false);
      }
    });
  }

  cancelSale(sale: Sale): void {
    const reason = prompt(`Motivo de cancelación para venta #${sale.id} (opcional):`);

    if (reason === null) return;

    this.saleService.cancel(sale.id, { reason: reason || undefined }).subscribe({
      next: (updated) => {
        this.sales.update(list => list.map(s => s.id === sale.id ? updated : s));
      },
      error: () => {
        this.error.set('Error al cancelar la venta');
      }
    });
  }
}
