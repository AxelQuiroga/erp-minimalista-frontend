import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CreateProductRequest, UpdateProductRequest } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  readonly categories = signal<Category[]>([]);
  readonly categoriesLoaded = signal(false);
  readonly isSubmitting = signal(false);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly submitted = signal(false);

  isEditing = false;
  editingId = 0;
  pageTitle = 'Nuevo Producto';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    costPrice: new FormControl('', [Validators.required, Validators.min(0.01)]),
    salePrice: new FormControl('', [Validators.required, Validators.min(0.01)]),
    currentStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl(0, [Validators.min(1)]),
    active: new FormControl(true),
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingId = Number(id);
      this.pageTitle = 'Editar Producto';

      this.productService.getById(this.editingId).subscribe({
        next: (product) => this.form.patchValue(product),
        error: (err: HttpErrorResponse) => this.error.set(err.error?.error || 'Error al cargar el producto')
      });
    }

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data.filter(c => c.active));
        this.categoriesLoaded.set(true);
      },
      error: () => this.error.set('Error al cargar categorías')
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.error.set('');

    if (this.isEditing) {
      this.productService.update(this.editingId, this.form.value as UpdateProductRequest).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al actualizar el producto');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.productService.create(this.form.value as CreateProductRequest).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al crear el producto');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
