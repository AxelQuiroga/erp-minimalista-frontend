import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';
import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale.model';

@Component({
  selector: 'app-sale-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './sale-detail.component.html',
  styleUrl: './sale-detail.component.scss'
})
export class SaleDetailComponent implements OnInit {

  readonly sale = signal<Sale | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.saleService.getById(id).subscribe({
      next: (data) => {
        this.sale.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cargar la venta');
        this.loading.set(false);
      }
    });
  }

  cancelSale(): void {
    const current = this.sale();
    if (!current || current.status !== 'COMPLETED') return;

    const reason = prompt(`Motivo de cancelación para venta #${current.id} (opcional):`);
    if (reason === null) return;

    this.saleService.cancel(current.id, { reason: reason || undefined }).subscribe({
      next: (updated) => {
        this.sale.set(updated);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cancelar la venta');
      }
    });
  }
}
