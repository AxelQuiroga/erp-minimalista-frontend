import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {

  readonly customers = signal<Customer[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly togglingId = signal<number | null>(null);
  readonly showInactive = signal(true);
  readonly search = signal('');

  private readonly search$ = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  readonly filteredCustomers = computed(() => {
    const all = this.customers();
    return this.showInactive() ? all : all.filter(c => c.active);
  });

  constructor(private customerService: CustomerService) {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.customerService.getAll(term || undefined).pipe(
        catchError((err) => { console.error(err); return of([]); })
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.error.set('Error al buscar clientes')
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.search$.next(value);
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

    this.togglingId.set(id);
    this.customerService.deactivate(id).subscribe({
      next: () => {
        this.customers.update(list => list.map(c => c.id === id ? { ...c, active: false } : c));
        this.togglingId.set(null);
      },
      error: () => {
        this.error.set('Error al desactivar el cliente');
        this.togglingId.set(null);
      }
    });
  }

  reactivateCustomer(id: number): void {
    if (!confirm('¿Estás seguro de reactivar este cliente?')) return;

    this.togglingId.set(id);
    this.customerService.updateStatus(id, { active: true }).subscribe({
      next: (updated) => {
        this.customers.update(list => list.map(c => c.id === id ? updated : c));
        this.togglingId.set(null);
      },
      error: () => {
        this.error.set('Error al reactivar el cliente');
        this.togglingId.set(null);
      }
    });
  }
}
