import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

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
  readonly dateError = signal('');

  readonly statusFilter = signal('');
  readonly fromFilter = signal('');
  readonly toFilter = signal('');

  readonly hasActiveFilters = computed(() => {
    const from = this.fromFilter();
    const to = this.toFilter();
    const status = this.statusFilter();
    return !!(status || from || to);
  });

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
          return this.saleService.getAll().pipe(
            catchError((err) => { console.error(err); return of([]); })
          );
        }
        return this.saleService.getAll(status, from, to).pipe(
          catchError((err) => { console.error(err); return of([]); })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => this.sales.set(data),
      error: (err: HttpErrorResponse) => this.error.set(err.error?.error || 'Error al filtrar ventas')
    });
  }

  ngOnInit(): void {
    this.loadSales();
  }

  onFilterChange(): void {
    const from = this.fromFilter();
    const to = this.toFilter();

    // Validar que from <= to si ambos están presentes
    if (from && to && from > to) {
      this.dateError.set('La fecha "Desde" no puede ser posterior a "Hasta"');
      return;
    }

    // Validar que no sea fecha futura
    const today = new Date().toLocaleDateString('sv-SE');
    if (to && to > today) {
      this.dateError.set('La fecha "Hasta" no puede ser futura');
      return;
    }
    if (from && from > today) {
      this.dateError.set('La fecha "Desde" no puede ser futura');
      return;
    }

    this.dateError.set('');
    this.filter$.next();
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.fromFilter.set('');
    this.toFilter.set('');
    this.dateError.set('');
    this.filter$.next();
  }

  private loadSales(): void {
    this.saleService.getAll().subscribe({
      next: (data) => {
        this.sales.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cargar ventas');
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
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cancelar la venta');
      }
    });
  }
}
