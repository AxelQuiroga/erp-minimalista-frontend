import { Component, OnInit } from '@angular/core';
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

  customers: Customer[] = [];
  products: Product[] = [];
  submitting = false;
  error = '';

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
      next: (data) => this.customers = data,
      error: () => this.error = 'Error al cargar clientes'
    });

    this.productService.getAll().subscribe({
      next: (data) => this.products = data.filter(p => p.active),
      error: () => this.error = 'Error al cargar productos'
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
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onProductSelect(index: number): void {
    const productId = this.items.at(index).get('productId')?.value;
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.items.at(index).get('unitPrice')?.setValue(product.salePrice);
    }
  }

  get total(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      return sum + qty * price;
    }, 0);
  }

  onSubmit(): void {
    if (this.form.invalid || this.items.length === 0) return;

    this.submitting = true;
    this.error = '';

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
        this.error = 'Error al crear la venta';
        this.submitting = false;
      }
    });
  }
}
