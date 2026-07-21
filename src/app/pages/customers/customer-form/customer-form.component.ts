import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomerService } from '../../../services/customer.service';
import { CreateCustomerRequest } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent {

  readonly isSubmitting = signal(false);
  readonly error = signal('');

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.error.set('');

    this.customerService.create(this.form.value as CreateCustomerRequest).subscribe({
      next: () => this.router.navigate(['/customers']),
      error: () => {
        this.error.set('Error al crear el cliente');
        this.isSubmitting.set(false);
      }
    });
  }
}
