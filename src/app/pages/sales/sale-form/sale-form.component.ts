import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { SaleService } from '../../../services/sale.service';
import { CustomerService } from '../../../services/customer.service';
import { ProductService } from '../../../services/product.service';
import { Customer } from '../../../models/customer.model';
import { Product } from '../../../models/product.model';
import { CreateSaleRequest } from '../../../models/sale.model';

@Component({
  selector: 'app-sale-form',
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.scss'
})
export class SaleFormComponent implements OnInit {

  readonly customers = signal<Customer[]>([]);
  readonly products = signal<Product[]>([]);
  readonly submitting = signal(false);
  readonly error = signal('');

  readonly total = signal(0);


  form = new FormGroup({
    customerId: new FormControl<number>(0, Validators.required),
    paymentMethod: new FormControl('', Validators.required),
    notes: new FormControl(''),
    items: new FormArray<FormGroup>([])
  });

  constructor(
    private saleService: SaleService,
    private customerService: CustomerService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.error.set('Error al cargar clientes')
    });

    this.productService.getAll().subscribe({
      next: (data) => this.products.set(data.filter(p => p.active)),
      error: () => this.error.set('Error al cargar productos')
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemForm = new FormGroup({
      productId: new FormControl<number>(0, Validators.required),
      quantity: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      unitPrice: new FormControl<number>(0, { nonNullable: true })
    });

    this.items.push(itemForm);
    this.updateTotal();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateTotal();
  }

  onProductSelect(index: number): void {
    const productId = this.items.at(index).get('productId')?.value;
    const product = this.products().find(p => p.id === productId);
    if (product) {
      this.items.at(index).get('unitPrice')?.setValue(product.salePrice);
    }
    this.updateTotal();
  }

  private updateTotal(): void {
    const total = this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      return sum + qty * price;
    }, 0);
    this.total.set(total);
  }

  onSubmit(): void {
    if (this.form.invalid || this.items.length === 0) return;

    this.submitting.set(true);
    this.error.set('');

    const request: CreateSaleRequest = {
      customerId: this.form.value.customerId!,
      paymentMethod: this.form.value.paymentMethod!,
      notes: this.form.value.notes || undefined,
      items: this.items.controls.map(item => ({
        productId: item.get('productId')?.value,
        quantity: item.get('quantity')?.value,
        unitPrice: item.get('unitPrice')?.value
      }))
    };

    this.saleService.create(request).subscribe({
      next: () => this.router.navigate(['/sales']),
      error: () => {
        this.error.set('Error al crear la venta');
        this.submitting.set(false);
      }
    });
  }
}
