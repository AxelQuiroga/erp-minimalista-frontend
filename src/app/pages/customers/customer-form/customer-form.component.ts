import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomerService } from '../../../services/customer.service';
import { CreateCustomerRequest, UpdateCustomerRequest } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {

  readonly isSubmitting = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly submitted = signal(false);

  isEditing = false;
  editingId = 0;
  pageTitle = 'Nuevo Cliente';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    active: new FormControl(true, Validators.required),
  });

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingId = Number(id);
      this.pageTitle = 'Editar Cliente';
      this.loading.set(true);

      this.customerService.getById(this.editingId).subscribe({
        next: (customer) => {
          this.form.patchValue(customer);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al cargar el cliente');
          this.loading.set(false);
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.error.set('');

    if (this.isEditing) {
      this.customerService.update(this.editingId, this.form.value as UpdateCustomerRequest).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al actualizar el cliente');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.customerService.create(this.form.value as CreateCustomerRequest).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al crear el cliente');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
