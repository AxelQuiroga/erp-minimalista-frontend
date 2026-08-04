import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CategoryService } from '../../../services/category.service';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../../models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {

  readonly isSubmitting = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly submitted = signal(false);

  isEditing = false;
  editingId = 0;
  pageTitle = 'Nueva Categoría';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingId = Number(id);
      this.pageTitle = 'Editar Categoría';
      this.loading.set(true);

      this.categoryService.getById(this.editingId).subscribe({
        next: (category) => {
          this.form.patchValue(category);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al cargar la categoría');
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
      this.categoryService.update(this.editingId, this.form.value as UpdateCategoryRequest).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al actualizar la categoría');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.categoryService.create(this.form.value as CreateCategoryRequest).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'Error al crear la categoría');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
