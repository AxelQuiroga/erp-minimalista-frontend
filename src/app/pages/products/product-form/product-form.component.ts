import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CreateProductRequest } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  categories: Category[] = [];
  submitting = false;
  error = '';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    costPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    salePrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    currentStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl(0, Validators.required),
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: () => this.error = 'Error al cargar categorías'
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.error = '';

    this.productService.create(this.form.value as CreateProductRequest).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.error = 'Error al crear el producto';
        this.submitting = false;
      }
    });
  }
}
