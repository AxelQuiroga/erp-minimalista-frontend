import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale.model';

@Component({
  selector: 'app-sale-list',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.scss'
})
export class SaleListComponent implements OnInit {

  readonly sales = signal<Sale[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
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
