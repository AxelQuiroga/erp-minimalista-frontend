import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {

  readonly customers = signal<Customer[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar clientes');
        this.loading.set(false);
      }
    });
  }

  deactivateCustomer(id: number): void {
    if (!confirm('¿Estás seguro de desactivar este cliente?')) return;

    this.customerService.deactivate(id).subscribe({
      next: () => {
        this.customers.update(list => list.map(c => c.id === id ? { ...c, active: false } : c));
      },
      error: () => {
        this.error.set('Error al desactivar el cliente');
      }
    });
  }
}
