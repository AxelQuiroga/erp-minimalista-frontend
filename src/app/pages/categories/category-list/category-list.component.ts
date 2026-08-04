import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly togglingId = signal<number | null>(null);
  readonly showInactive = signal(true);

  readonly filteredCategories = computed(() => {
    const all = this.categories();
    return this.showInactive() ? all : all.filter(c => c.active);
  });

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al cargar categorías');
        this.loading.set(false);
      }
    });
  }

  deactivateCategory(id: number): void {
    if (!confirm('¿Estás seguro de desactivar esta categoría?')) return;

    this.togglingId.set(id);
    this.categoryService.deactivate(id).subscribe({
      next: () => {
        this.categories.update(list => list.map(c => c.id === id ? { ...c, active: false } : c));
        this.togglingId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al desactivar la categoría');
        this.togglingId.set(null);
      }
    });
  }

  reactivateCategory(id: number): void {
    if (!confirm('¿Estás seguro de reactivar esta categoría?')) return;

    this.togglingId.set(id);
    this.categoryService.updateStatus(id, { active: true }).subscribe({
      next: (updated) => {
        this.categories.update(list => list.map(c => c.id === id ? updated : c));
        this.togglingId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error || 'Error al reactivar la categoría');
        this.togglingId.set(null);
      }
    });
  }
}
