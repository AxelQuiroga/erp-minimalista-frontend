import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale.model';

@Component({
  selector: 'app-sale-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.scss'
})
export class SaleListComponent implements OnInit {

  sales: Sale[] = [];
  loading = true;
  error = '';

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.saleService.getAll().subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar ventas';
        this.loading = false;
      }
    });
  }
}
