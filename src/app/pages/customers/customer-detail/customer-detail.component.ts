import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {

  readonly customer = signal<Customer | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.customerService.getById(id).subscribe({
      next: (data) => {
        this.customer.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cargar el cliente');
        this.loading.set(false);
      }
    });
  }
}
