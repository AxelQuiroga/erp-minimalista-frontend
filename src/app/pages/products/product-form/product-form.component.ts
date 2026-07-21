import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

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
  readonly isSubmitting = signal(false);
  readonly loading = signal(true);
  readonly error = signal('');

  isEditing = false;
  editingId = 0;
  pageTitle = 'Nuevo Producto';

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
        error: () => this.error.set('Error al cargar el producto')
      });
    }

    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: () => this.error.set('Error al cargar categorías')
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.error.set('');

    if (this.isEditing) {
      this.productService.update(this.editingId, this.form.value as UpdateProductRequest).subscribe({
        next: () => this.router.navigate(['/products']),
        error: () => {
          this.error.set('Error al actualizar el producto');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.productService.create(this.form.value as CreateProductRequest).subscribe({
        next: () => this.router.navigate(['/products']),
        error: () => {
          this.error.set('Error al crear el producto');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
